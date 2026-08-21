export type PmStatus = 'New' | 'Open' | 'In Progress' | 'On Hold' | 'Resolved';
export type PmPriority = 'High' | 'Medium' | 'Low';

export interface PreventiveMaintenanceRow {
  id: string;
  title: string;
  trigger: string;
  status: PmStatus;
  priority: PmPriority;
  schedule: string;
  nextSchedule: string;
  property: string;
  unit: string;
  category: string;
  vendor: string;
  asset: string;
  commonArea: string;
  lastWorkOrder: string;
  createdAt: string;
}

export const PM_ROWS: PreventiveMaintenanceRow[] = [
  {
    id: '32001',
    title: 'FixPro Services',
    trigger: 'Kitchen plumbing repair',
    status: 'New',
    priority: 'Medium',
    schedule: '4 weeks',
    nextSchedule: '19-07-2026',
    property: 'Marina Heights Towers',
    unit: 'Apartment-PR-012',
    category: 'HVAC Maintenance',
    vendor: 'AirCool Solutions',
    asset: 'AC-UNIT-09',
    commonArea: '-',
    lastWorkOrder: 'WO-8820',
    createdAt: '12-01-2026, 13:06'
  },
  {
    id: '32002',
    title: 'Roof Drain Inspection',
    trigger: 'Seasonal drainage check',
    status: 'Open',
    priority: 'High',
    schedule: '12 weeks',
    nextSchedule: '02-08-2026',
    property: 'Saraya Plaza',
    unit: 'Common Area',
    category: 'Plumbing',
    vendor: 'PlumbRight LLC',
    asset: 'DRAIN-03',
    commonArea: 'Roof Terrace',
    lastWorkOrder: 'WO-8794',
    createdAt: '08-01-2026, 09:22'
  },
  {
    id: '32003',
    title: 'Lift Motor Service',
    trigger: 'OEM service interval',
    status: 'In Progress',
    priority: 'High',
    schedule: '26 weeks',
    nextSchedule: '15-09-2026',
    property: 'Orville Tower A',
    unit: 'Lift Lobby',
    category: 'Mechanical',
    vendor: 'ElevTech ME',
    asset: 'LIFT-A1',
    commonArea: 'Main Lobby',
    lastWorkOrder: 'WO-8701',
    createdAt: '05-01-2026, 16:40'
  },
  {
    id: '32004',
    title: 'Fire Pump Test',
    trigger: 'Monthly compliance',
    status: 'On Hold',
    priority: 'Medium',
    schedule: '4 weeks',
    nextSchedule: '28-07-2026',
    property: 'Marina Heights Towers',
    unit: 'Basement B1',
    category: 'Fire Safety',
    vendor: 'SafeGuard Systems',
    asset: 'PUMP-FS-01',
    commonArea: 'Plant Room',
    lastWorkOrder: 'WO-8688',
    createdAt: '02-01-2026, 11:05'
  },
  {
    id: '32005',
    title: 'Generator Load Bank',
    trigger: 'Quarterly load test',
    status: 'Resolved',
    priority: 'Low',
    schedule: '13 weeks',
    nextSchedule: '10-10-2026',
    property: 'Orville Tower B',
    unit: 'Generator Yard',
    category: 'Electrical',
    vendor: 'PowerGrid Services',
    asset: 'GEN-B2',
    commonArea: '-',
    lastWorkOrder: 'WO-8650',
    createdAt: '28-12-2025, 14:18'
  }
];

export const PM_FORM_OPTIONS = {
  timeSpans: ['Days', 'Weeks', 'Months', 'Years'],
  properties: ['Marina Heights Towers', 'Saraya Plaza', 'Orville Tower A', 'Orville Tower B'],
  units: ['Apartment-PR-012', 'Common Area', 'Lift Lobby', 'Basement B1', 'Generator Yard'],
  commonAreas: ['Roof Terrace', 'Main Lobby', 'Plant Room', 'Parking Level P1'],
  categories: ['HVAC Maintenance', 'Plumbing', 'Mechanical', 'Electrical', 'Fire Safety'],
  vendors: ['AirCool Solutions', 'PlumbRight LLC', 'ElevTech ME', 'SafeGuard Systems', 'PowerGrid Services'],
  technicians: ['Ahmed Malik', 'Sara Khan', 'Omar Faris', 'Layla Hassan']
};
