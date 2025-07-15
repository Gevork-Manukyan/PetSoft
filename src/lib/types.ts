export type Pet = {
  id: string;
  name: string;
  ownerName: string;
  imageURL: string;
  age: number;
  notes: string | null;
};

export enum PetFormFields {
  NAME = "name",
  OWNER = "ownerName",
  URL = "imageUrl",
  AGE = "age",
  NOTES = "notes",
}