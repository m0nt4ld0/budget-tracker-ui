export function useUtils() {

    const ars = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const dateFormatter = new Intl.DateTimeFormat("es-AR");

    const formatARS = (value: number) => ars.format(value);

    const formatDate = (date: string | Date) =>
    dateFormatter.format(new Date(date));

    return {
        formatARS,
        formatDate,
    };
}

export const { formatARS, formatDate } = useUtils();
