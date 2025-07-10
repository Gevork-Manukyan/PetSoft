export default function Stats({ guests }: { guests: number }) {
    return (
        <section className="text-center">
            <p className="text-2xl font-bold leading-6">{guests}</p>
            <p className="opacity-80">current guests</p>
        </section>
    )
}