import { Routes } from '@angular/router';

import { SdnComponent } from './sdn/sdn.component';
import { ProcessComponent } from './process/process.component';
import { SdnBillsComponent } from './sdn-bills/sdn-bills.component';
import { QuicktransComponent } from './quicktrans/quicktrans.component';


export const servicesRoutingModule = {
  routes: <Routes>[
    { path: 'sdn', component: SdnComponent },
    { path: 'process', component: ProcessComponent },
    { path: 'sdn-bills', component: SdnBillsComponent },
    { path: 'quicktrans', component: QuicktransComponent },
  ],
};
