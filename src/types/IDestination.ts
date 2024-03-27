import ISender from "./ISender";

type OmittedValuesType = Omit<ISender, "transporterId"> 

export default interface IDestination extends OmittedValuesType {
    senderId: string;
}
