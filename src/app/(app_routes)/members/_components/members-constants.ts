export const MEMBERS_NAME_SEARCH_LIMIT = 100

export type MembersDraftFilters = {
  code: string
  name: string
  registration: string
  email: string
  phone: string
}

export function defaultMembersDraftFilters(): MembersDraftFilters {
  return {
    code: "",
    name: "",
    registration: "",
    email: "",
    phone: "",
  }
}

export function capitalizeLabel(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function membersListTitle(plural: string): string {
  return capitalizeLabel(plural)
}

export function membersListSubtitle(plural: string): string {
  return `Gerencie e consulte os ${plural} cadastrados`
}

export function membersIdleTitle(plural: string): string {
  return `Nenhuma busca realizada para ${plural}`
}

export function membersIdleHint(plural: string): string {
  return `Clique em Buscar ${plural} para listar os registros ou refine os filtros`
}

export function membersSearchingTitle(plural: string): string {
  return `Buscando ${plural}...`
}
