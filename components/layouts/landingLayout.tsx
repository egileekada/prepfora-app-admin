
interface Props { 
    children: React.ReactNode; 
}

export default function LandingLayout (
    { children } : Props
) {
    return( 
        <main className="container mx-auto max-w-7xl px-6 flex-grow">
            {children}
        </main>
    )
}