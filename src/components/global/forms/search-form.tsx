"use client"

import { Loader2, Search } from "lucide-react"
import type { FormEvent, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type SearchFormField = {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    ariaLabel?: string
    inputMode?: "text" | "numeric"
    /** Quando true, destaca o campo como filtro ativo da última busca. */
    isApplied?: boolean
}

type SearchFormProps = {
    title?: string
    fields: SearchFormField[]
    onSearch: () => void
    isSearching?: boolean
    searchLabel?: string
    searchTooltip?: string
    idPrefix?: string
    footer?: ReactNode
    loadingLabel?: string
    /** Indica se uma busca já foi executada (habilita destaque de filtros aplicados). */
    hasSearched?: boolean
    /** Valores dos filtros na última busca, indexados pelo `id` do campo. */
    appliedValues?: Record<string, string | undefined>
}

function resolveFieldApplied(
    field: SearchFormField,
    hasSearched?: boolean,
    appliedValues?: Record<string, string | undefined>
) {
    if (field.isApplied !== undefined) return field.isApplied
    if (!hasSearched) return false
    const applied = appliedValues?.[field.id]
    return typeof applied === "string" && applied.trim().length > 0
}

type SearchFormFloatingInputProps = {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    ariaLabel?: string
    inputMode?: "text" | "numeric"
    isApplied?: boolean
}

function SearchFormFloatingInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    disabled,
    ariaLabel,
    inputMode,
    isApplied = false,
}: SearchFormFloatingInputProps) {
    const floatingLabel = placeholder ?? label

    return (
        <div className="relative">
            <Input
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder=" "
                disabled={disabled}
                aria-label={ariaLabel ?? label}
                inputMode={inputMode}
                className={cn(
                    "peer h-11 px-3 pb-2 pt-5 transition-[border-color,box-shadow,background-color]",
                    isApplied &&
                    "border-primary/60 bg-primary/5 dark:border-primary/50 dark:bg-primary/10",
                    "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25",
                    isApplied &&
                    "focus-visible:border-primary focus-visible:ring-primary/30"
                )}
            />
            <label
                htmlFor={id}
                className={cn(
                    "pointer-events-none absolute left-2.5 z-10 max-w-[calc(100%-1.25rem)] truncate",
                    "origin-left text-sm text-muted-foreground transition-all duration-200",
                    "top-1/2 -translate-y-1/2",
                    "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-[0.85] peer-focus:bg-card/5 peer-focus:backdrop-blur-[6px] peer-focus:px-0.5 peer-focus:font-medium peer-focus:text-primary",
                    "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:bg-card peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-foreground",
                    isApplied &&
                    "peer-[:not(:placeholder-shown)]:bg-card/5 peer-[:not(:placeholder-shown)]:backdrop-blur-[6px] peer-[:not(:placeholder-shown)]:px-0.5 peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-primary"
                )}
            >
                {floatingLabel}
            </label>
        </div>
    )
}

export function SearchForm({
    fields,
    onSearch,
    isSearching = false,
    searchLabel = "Buscar",
    searchTooltip,
    idPrefix = "search",
    footer,
    loadingLabel = "Carregando...",
    hasSearched = false,
    appliedValues,
    // title,
}: SearchFormProps) {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!isSearching) {
            onSearch()
        }
    }

    return (
        <div className="border-b border-border pb-4 bg-background shadow-none">

            {/* <div className="flex items-center justify-start gap-2 pl-4 pt-4">
                {title && <p className="text-lg font-bold text-muted-foreground">{title}</p>}
            </div> */}

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {fields.map((field) => (
                        <SearchFormFloatingInput
                            key={field.id}
                            id={`${idPrefix}-${field.id}`}
                            label={field.label}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={field.placeholder}
                            disabled={isSearching}
                            ariaLabel={field.ariaLabel ?? field.label}
                            inputMode={field.inputMode}
                            isApplied={resolveFieldApplied(
                                field,
                                hasSearched,
                                appliedValues
                            )}
                        />
                    ))}
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        type="submit"
                        disabled={isSearching}
                        tooltip={searchTooltip}
                    >
                        {isSearching ? (
                            <>
                                <Loader2 className="size-4 animate-spin" aria-hidden />
                                {loadingLabel}
                            </>
                        ) : (
                            <>
                                <Search className="size-4" aria-hidden />
                                {searchLabel}
                            </>
                        )}
                    </Button>
                    {footer}
                </div>
            </form>
        </div>
    )
}
