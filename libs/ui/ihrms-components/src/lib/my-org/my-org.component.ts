import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ihrms-my-org',
  templateUrl: './my-org.component.html',
  styleUrls: ['./my-org.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyOrgComponent {

  chartSeries =
    {
      type: 'organization',
      name: 'MyCompany',
      keys: ['from', 'to'],
      data: [
        ['Shareholders', 'Board'],
        ['Board', 'CEO'],
        ['CEO', 'CTO'],
        ['CEO', 'CPO'],
        ['CEO', 'CSO'],
        ['CEO', 'HR'],
        ['CTO', 'Product'],
        ['CTO', 'Web'],
        ['CSO', 'Sales'],
        ['HR', 'Market'],
        ['CSO', 'Market'],
        ['HR', 'Market'],
        ['CTO', 'Market']
      ],
      levels: [{
        level: 0,
        color: 'silver',
        dataLabels: {
          color: 'black'
        },
        height: 25
      }, {
        level: 1,
        color: 'silver',
        dataLabels: {
          color: 'black'
        },
        height: 25
      }, {
        level: 2,
        color: '#980104'
      }, {
        level: 4,
        color: '#359154'
      }],
      nodes: [{
        id: 'Shareholders'
      }, {
        id: 'Board'
      }, {
        id: 'CEO',
        title: 'CEO',
        name: 'Grethe Hjetland',
        image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131126/Highsoft_03862_.jpg'
      }, {
        id: 'HR',
        title: 'HR/CFO',
        name: 'Anne Jorunn Fjærestad',
        color: '#007ad0',
        image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131210/Highsoft_04045_.jpg'
      }, {
        id: 'CTO',
        title: 'CTO',
        name: 'Christer Vasseng',
        image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131120/Highsoft_04074_.jpg'
      }, {
        id: 'CPO',
        title: 'CPO',
        name: 'Torstein Hønsi',
        image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131213/Highsoft_03998_.jpg'
      }, {
        id: 'CSO',
        title: 'CSO',
        name: 'Anita Nesse',
        image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131156/Highsoft_03834_.jpg'
      }, {
        id: 'Product',
        name: 'Product developers'
      }, {
        id: 'Web',
        name: 'Web devs, sys admin'
      }, {
        id: 'Sales',
        name: 'Sales team'
      }, {
        id: 'Market',
        name: 'Marketing team',
        column: 5
      }],
      colorByPoint: false,
      color: '#007ad0',
      dataLabels: {
        color: 'white'
      },
      borderColor: 'white',
      nodeWidth: 65
    };

  getHeight(offsetHeight: number | undefined | any) {
    return offsetHeight - 50;
  }

}
