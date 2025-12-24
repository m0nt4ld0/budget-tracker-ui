export function useUtils() {

    const ars = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formatARS = (value: number) => ars.format(value);

    const formatDate = (dateStr: string): string => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }


    return {
        formatARS,
        formatDate,
    };
}

export const { formatARS, formatDate } = useUtils();
