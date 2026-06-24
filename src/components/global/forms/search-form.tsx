"use client"

import { Loader2, Search } from "lucide-react"
import type { FormEvent, ReactNode } from "react"

import { formInputFocusClassName } from "@/components/global/forms/form-input-classes"
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
    formClassName?: string
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

type SearchFormInputProps = {
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

function SearchFormInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    disabled,
    ariaLabel,
    inputMode,
    isApplied = false,
}: SearchFormInputProps) {
    return (
        <Input
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder ?? label}
            disabled={disabled}
            aria-label={ariaLabel ?? label}
            inputMode={inputMode}
            className={cn(
                formInputFocusClassName,
                isApplied && "border-primary/60 dark:border-primary/50"
            )}
        />
    )
}

export function SearchForm({
    fields,
    onSearch,
    isSearching = false,
    searchLabel = "Buscar",
    searchTooltip,
    idPrefix = "search",
    formClassName,
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
        <div className={cn("shadow-none", formClassName)}>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {fields.map((field) => (
                        <SearchFormInput
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
