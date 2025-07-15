import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { PetEssentials, PetFormFields } from "@/lib/types";
import PetFormBtn from "./pet-form-btn";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmit: () => void;
};

export default function PetForm({ actionType, onFormSubmit }: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  const handleAction = async (formData: FormData) => {
    onFormSubmit();

    const petData: PetEssentials = {
      name: formData.get(PetFormFields.NAME) as string,
      ownerName: formData.get(PetFormFields.OWNER) as string,
      imageURL:
        (formData.get(PetFormFields.URL) as string) ||
        "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      age: Number(formData.get(PetFormFields.AGE)),
      notes: formData.get(PetFormFields.NOTES) as string,
    };

    if (actionType === "add") {
      await handleAddPet(petData);
    } else if (actionType === "edit") {
      await handleEditPet(selectedPet!.id, petData);
    }
  };

  return (
    <form action={handleAction} className="flex flex-col">
      <div className="space-y-3">
        <FormDiv>
          <Label htmlFor={PetFormFields.NAME}>Name</Label>
          <Input
            id={PetFormFields.NAME}
            name={PetFormFields.NAME}
            type="text"
            required
            defaultValue={actionType === "edit" ? selectedPet?.name : ""}
          />
        </FormDiv>
        <FormDiv>
          <Label htmlFor={PetFormFields.OWNER}>Owner</Label>
          <Input
            id={PetFormFields.OWNER}
            name={PetFormFields.OWNER}
            type="text"
            required
            defaultValue={actionType === "edit" ? selectedPet?.ownerName : ""}
          />
        </FormDiv>
        <FormDiv>
          <Label htmlFor={PetFormFields.URL}>Image URL</Label>
          <Input
            id={PetFormFields.URL}
            name={PetFormFields.URL}
            type="text"
            defaultValue={actionType === "edit" ? selectedPet?.imageURL : ""}
          />
        </FormDiv>
        <FormDiv>
          <Label htmlFor={PetFormFields.AGE}>Age</Label>
          <Input
            id={PetFormFields.AGE}
            name={PetFormFields.AGE}
            type="number"
            required
            defaultValue={actionType === "edit" ? selectedPet?.age : ""}
          />
        </FormDiv>
        <FormDiv>
          <Label htmlFor={PetFormFields.NOTES}>Notes</Label>
          <Textarea
            id={PetFormFields.NOTES}
            name={PetFormFields.NOTES}
            rows={3}
            required
            defaultValue={actionType === "edit" ? selectedPet?.notes || "" : ""}
          />
        </FormDiv>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}

function FormDiv({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}
