import ISender from "./ISender";

type OmitedValuesType = "transporterId"

export default interface IDestination extends Omit<ISender, OmitedValuesType> {
    senderId: string;
}