import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { PetFormFields } from "@/lib/types";
import { addPet, editPet } from "@/actions/actions";
import PetFormBtn from "./pet-form-btn";
import { toast } from "sonner";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmit: () => void;
};

export default function PetForm({ actionType, onFormSubmit }: PetFormProps) {
  const { selectedPet } = usePetContext();

  const handleAction = async (formData: FormData) => {
    let error;
    
    if (actionType === "add") {
      error = await addPet(formData);
    } else if (actionType === "edit") {
      error = await editPet(selectedPet!.id, formData);
    }

    if (error) toast.warning(error.message);

    onFormSubmit();
  }

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
