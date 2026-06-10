type MembershipPageHeaderProps = {
  title: string
  description: string
  note?: string
}

export function MembershipPageHeader({
  title,
  description,
  note,
}: MembershipPageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {note && (
        <p className="mt-2 text-sm text-muted-foreground">{note}</p>
      )}
    </div>
  )
}
