import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import PetContextProvider from "@/contexts/pet-context-provider";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const response = await fetch("https://bytegrad.com/course-assets/projects/petsoft/api/pets");
    if (!response.ok) {
        throw new Error("Failed to fetch pets");
    }
    const pets = await response.json();
    
    return (
        <>
            <BackgroundPattern />

            <div className="flex flex-col min-h-screen max-w-[1050px] mx-auto px-4">
                <AppHeader />
                <PetContextProvider pets={pets}>
                    {children}
                </PetContextProvider>
                <AppFooter />
            </div>
        </>
    )
}