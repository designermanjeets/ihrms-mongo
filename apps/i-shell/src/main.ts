import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LicenseManager } from 'ag-grid-enterprise';
import { registerLicense } from '@syncfusion/ej2-base';

import "ag-grid-enterprise";


// Registering Syncfusion license key
registerLicense('ORg4AjUWIQA/Gnt2VFhiQlRPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtRdUVrWXxceXBRR2c=');
// registerLicense('Mgo+DSMBaFt+QHJqUE1hXk5Hd0BLVGpAblJ3T2ZQdVt5ZDU7a15RRnVfR19hSHpQdEdmXnlecA==;Mgo+DSMBPh8sVXJ1S0R+WVpFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jTHxRd0FgW31bd3NSRg==;ORg4AjUWIQA/Gnt2VFhiQlRPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtRdERnWn1cdXNcRWA=;MjE0NjY4OEAzMjMxMmUzMjJlMzVhOUZIRlNVb0RLTyt2VFlHeDl0TnFJK2dFNDl4a0JNTEZRemdEK3Z2OVZBPQ==;MjE0NjY4OUAzMjMxMmUzMjJlMzVEN2JQWWVJenh6L3BqMThrMXJCR2UwYmh1NmxoY1Z4ZUIwWnVMVmhaWENNPQ==;NRAiBiAaIQQuGjN/V0d+Xk9BfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5WdEdiXXxccnFdTmVc;MjE0NjY5MUAzMjMxMmUzMjJlMzVZYUl2NElUUUROanBRMXFOZHJlUUx6UlpvRDlMNXRJTnBQbGJxZ0swZzNZPQ==;MjE0NjY5MkAzMjMxMmUzMjJlMzVmQmlSTVo4SkNzT1RRZkdBeEVsbHNQcjBBdHJzc2VCSXRKaVphLzRxYVA4PQ==;Mgo+DSMBMAY9C3t2VFhiQlRPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtRdERnWn1cdX1TQGA=;MjE0NjY5NEAzMjMxMmUzMjJlMzVSb1RtR3ozeWl2dE1tQ2p0OFRnbmU2NHh3dE1KeEFiZ1BidFN2SzZ6T1lFPQ==;MjE0NjY5NUAzMjMxMmUzMjJlMzVsa1ptNWQrWTNOdVhWckZoWFc3SmJqNDcwREN2VUVaampVbjd1Nyt2UnZZPQ==;MjE0NjY5NkAzMjMxMmUzMjJlMzVZYUl2NElUUUROanBRMXFOZHJlUUx6UlpvRDlMNXRJTnBQbGJxZ0swZzNZPQ==');

LicenseManager.setLicenseKey('For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-21_January_2023_[v2]_MTY3NDI1OTIwMDAwMA==bb59de10c4d24a79e538453ee3c2c2ab');
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
