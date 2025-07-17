import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { PetFormFields } from "@/lib/types";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";
import { petFormSchema, PetFormSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PET_IMAGE_URL } from "@/lib/constants";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmit: () => void;
};

export default function PetForm({ actionType, onFormSubmit }: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();
  const {
    register,
    trigger,
    getValues,
    formState: { errors }
  } = useForm<PetFormSchema>({
    resolver: zodResolver(petFormSchema),
  });

  const handleAction = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    onFormSubmit();

    const petData = getValues();
    petData.imageUrl = petData.imageUrl || DEFAULT_PET_IMAGE_URL;

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
            {...register(PetFormFields.NAME)}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </FormDiv>
        <FormDiv>
          <Label htmlFor={PetFormFields.OWNER}>Owner</Label>
          <Input
            id={PetFormFields.OWNER}
            {...register(PetFormFields.OWNER)}
          />
          {errors.ownerName && <p className="text-red-500">{errors.ownerName.message}</p>}
        </FormDiv>
        <FormDiv>
          <Label htmlFor={PetFormFields.URL}>Image URL</Label>
          <Input
            id={PetFormFields.URL}
            {...register(PetFormFields.URL)}
          />
          {errors.imageUrl && <p className="text-red-500">{errors.imageUrl.message}</p>}
        </FormDiv>
        <FormDiv>
          <Label htmlFor={PetFormFields.AGE}>Age</Label>
          <Input
            id={PetFormFields.AGE}
            {...register(PetFormFields.AGE)}
          />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </FormDiv>
        <FormDiv>
          <Label htmlFor={PetFormFields.NOTES}>Notes</Label>
          <Textarea
            id={PetFormFields.NOTES}
            {...register(PetFormFields.NOTES)}
          />
          {errors.notes && <p className="text-red-500">{errors.notes.message}</p>}
        </FormDiv>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}

function FormDiv({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}
