import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { environment } from '../../environments/environment';
import { AuthService, TokenStorageService } from '@ihrms/auth';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';

const uploadLink = (createUploadLink({
  uri: environment.apiURL,
  headers: {
    'x-apollo-operation-name': 'Upload',
    // 'Apollo-Require-Preflight': 'true',
  }
})) as ApolloLink;

export function createApollo(
  httpLink: HttpLink,
  authService: AuthService,
  tokenService: TokenStorageService
): ApolloClientOptions<any> {

  const authLink = new ApolloLink((operation: any, forward: any) => {
    operation.setContext({ headers: { 'Access-Control-Allow-Origin': "*" } });
    if(operation.operationName !== 'login' && operation.operationName !== 'ChangePassword') {
      operation.setContext({
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('auth-token'),
          tenantId: sessionStorage.getItem('tenantId')
        }
      });
    }
    return forward(operation);
  });

  const errorLink = (onError(({ forward, graphQLErrors, networkError, operation  }): any => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) => {
          console.log( `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
          authService.toaster_Service.error( `${message}`, `${locations}`, { timeOut: 5000 } );
          if(message.includes('JWT_EXPIRED')) {
            authService.logout();
          }
          return (message.toLowerCase() === 'unauthorized') && authService.refreshToken(JSON.parse(tokenService.getToken() as string))
            .pipe(
              // switchMap((res: any) => forward(operation))
            );
        }
      );

    if (networkError) {
      authService.toaster_Service.error( `${networkError}`, `Network error`, { timeOut: 5000 } );
      console.log(`[Network error]: ${networkError}`);
    };
  }) as unknown) as ApolloLink;

  const link = ApolloLink.from([errorLink, authLink, uploadLink]);

  return {
    link,
    cache: new InMemoryCache({
      addTypename: false
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only'
      }
    }
  };
}

@NgModule({
  imports: [
    ApolloModule
  ],
  exports: [HttpLinkModule],
  providers: [
    AuthService,
    ToastrService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, AuthService],
    }
  ]
})

export class GraphQLModule {
}
