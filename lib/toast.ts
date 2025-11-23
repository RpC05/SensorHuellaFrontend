import { toast as sonnerToast } from 'sonner';

export const toast = {
    success: (message: string, options?: { description?: string }) => {
        sonnerToast.success(message, options);
    },

    error: (message: string, options?: { description?: string }) => {
        sonnerToast.error(message, options);
    },

    info: (message: string, options?: { description?: string }) => {
        sonnerToast.info(message, options);
    },

    warning: (message: string, options?: { description?: string }) => {
        sonnerToast.warning(message, options);
    },

    loading: (message: string, options?: { description?: string }) => {
        return sonnerToast.loading(message, options);
    },

    promise: <T,>(
        promise: Promise<T>,
        {
            loading,
            success,
            error,
        }: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) => {
        return sonnerToast.promise(promise, { loading, success, error });
    },
};
