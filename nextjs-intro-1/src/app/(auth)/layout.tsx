export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    return (<div>
        <h1>Custome header</h1>
        {children}
    </div>)
}
