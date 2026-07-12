export interface AuthState {
  userName: string | null;
  roleName: string | null;
  token: string | null;
  companyId: number | null;
  userId: number | null;
  userCode: string | null;
}

export interface CommonState {
    typeId:number;
    filterId: number;
    filterText: string;
    filterText1: string;
    userId: number;
    companyId: number;
    clientId: string;
}

export const initialState: CommonState = {
  typeId:13,
  filterId: 0,
  filterText: "",
  filterText1: "0",
  userId: 0,
  clientId: "74BB6922",
  companyId: 1
  
}
