export default function ContentBlock({ children }: { children: React.ReactNode }) {
    return (
        <section className="bg-[#f7f8fa] shadow-sm rounded-md overflow-hidden h-full w-full">
            {children}
        </section>
    )
}