/**
 * Form Validation Hooks - Integration with react-hook-form and Zod
 */

import { useForm, UseFormProps, UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodSchema } from 'zod';
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAsyncMutation } from './utils/use-api';

/**
 * Enhanced form hook with Zod validation
 */
export function useValidatedForm<T extends FieldValues>(
  schema: ZodSchema<T>,
  options?: Omit<UseFormProps<T>, 'resolver'>
): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    ...options,
  });
}

/**
 * Form hook with async submission
 */
export function useAsyncForm<TData extends FieldValues, TResult = any>(
  schema: ZodSchema<TData>,
  submitFunction: (data: TData) => Promise<TResult>,
  options?: {
    onSuccess?: (result: TResult, data: TData) => void;
    onError?: (error: Error, data: TData) => void;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string | ((result: TResult) => string);
    errorMessage?: string | ((error: Error) => string);
    resetOnSuccess?: boolean;
  }
) {
  const form = useValidatedForm(schema);
  const { mutate: submit, isLoading, error, data } = useAsyncMutation<TResult, TData>();

  const onSubmit = useCallback(async (data: TData) => {
    try {
      const result = await submit(submitFunction, data, {
        showSuccessToast: options?.showSuccessToast,
        showErrorToast: options?.showErrorToast,
        successMessage: typeof options?.successMessage === 'function' 
          ? undefined 
          : options?.successMessage,
        errorMessage: typeof options?.errorMessage === 'function' 
          ? undefined 
          : options?.errorMessage,
        onSuccess: (result) => {
          if (typeof options?.successMessage === 'function') {
            toast({
              title: 'Success',
              description: options.successMessage(result),
            });
          }
          
          if (options?.resetOnSuccess) {
            form.reset();
          }
          
          options?.onSuccess?.(result, data);
        },
        onError: (error) => {
          if (typeof options?.errorMessage === 'function') {
            toast({
              title: 'Error',
              description: options.errorMessage(error),
              variant: 'destructive',
            });
          }
          
          options?.onError?.(error, data);
        },
      });
      
      return result;
    } catch (error) {
      // Error is already handled in the mutate function
      throw error;
    }
  }, [submit, submitFunction, options, form]);

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: isLoading,
    submitError: error,
    submitResult: data,
  };
}

/**
 * Multi-step form hook
 */
export function useMultiStepForm<T extends FieldValues>(
  steps: Array<{
    name: string;
    schema: ZodSchema<Partial<T>>;
    fields: Array<keyof T>;
  }>,
  options?: UseFormProps<T>
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const form = useForm<T>({
    mode: 'onChange',
    ...options,
  });

  const currentStepConfig = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  const validateCurrentStep = useCallback(async () => {
    if (!currentStepConfig) return false;
    
    const currentStepData: Partial<T> = {};
    for (const field of currentStepConfig.fields) {
      currentStepData[field] = form.getValues(field as Path<T>);
    }

    try {
      currentStepConfig.schema.parse(currentStepData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            form.setError(err.path[0] as Path<T>, {
              type: 'manual',
              message: err.message,
            });
          }
        });
      }
      return false;
    }
  }, [currentStepConfig, form]);

  const nextStep = useCallback(async () => {
    if (isLastStep) return false;
    
    const isValid = await validateCurrentStep();
    if (!isValid) return false;
    
    setCompletedSteps(prev => [...prev, currentStep]);
    setCurrentStep(prev => prev + 1);
    return true;
  }, [isLastStep, validateCurrentStep, currentStep]);

  const prevStep = useCallback(() => {
    if (isFirstStep) return false;
    setCurrentStep(prev => prev - 1);
    return true;
  }, [isFirstStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return false;
    setCurrentStep(stepIndex);
    return true;
  }, [steps.length]);

  const isStepCompleted = useCallback((stepIndex: number) => {
    return completedSteps.includes(stepIndex);
  }, [completedSteps]);

  const getStepProgress = useCallback(() => {
    return {
      current: currentStep + 1,
      total: steps.length,
      percentage: ((currentStep + 1) / steps.length) * 100,
      completed: completedSteps.length,
    };
  }, [currentStep, steps.length, completedSteps.length]);

  return {
    ...form,
    currentStep,
    currentStepConfig,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    isStepCompleted,
    getStepProgress,
    completedSteps,
    steps,
  };
}

/**
 * Form validation with real-time API validation
 */
export function useFormWithAsyncValidation<T extends FieldValues>(
  schema: ZodSchema<T>,
  asyncValidators?: {
    [K in keyof T]?: (value: T[K]) => Promise<string | undefined>;
  },
  debounceMs = 500
) {
  const form = useValidatedForm(schema);
  const [asyncErrors, setAsyncErrors] = useState<Record<string, string>>({});
  const [validatingFields, setValidatingFields] = useState<Set<string>>(new Set());

  const validateFieldAsync = useCallback(async (
    fieldName: keyof T, 
    value: T[keyof T]
  ) => {
    const validator = asyncValidators?.[fieldName];
    if (!validator) return;

    setValidatingFields(prev => new Set(prev).add(fieldName as string));

    try {
      const error = await validator(value);
      setAsyncErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[fieldName as string] = error;
        } else {
          delete newErrors[fieldName as string];
        }
        return newErrors;
      });
    } catch (error) {
      console.error(`Async validation error for field ${String(fieldName)}:`, error);
    } finally {
      setValidatingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName as string);
        return newSet;
      });
    }
  }, [asyncValidators]);

  // Set up watchers for fields with async validators
  useEffect(() => {
    if (!asyncValidators) return;

    const subscriptions = Object.keys(asyncValidators).map(fieldName => {
      const subscription = form.watch((value, { name }) => {
        if (name === fieldName && value[fieldName] !== undefined) {
          const timeoutId = setTimeout(() => {
            validateFieldAsync(fieldName as keyof T, value[fieldName]);
          }, debounceMs);

          return () => clearTimeout(timeoutId);
        }
      });
      return subscription;
    });

    return () => {
      subscriptions.forEach(subscription => {
        if (subscription && typeof subscription.unsubscribe === 'function') {
          subscription.unsubscribe();
        }
      });
    };
  }, [form, asyncValidators, validateFieldAsync, debounceMs]);

  const getFieldError = useCallback((fieldName: keyof T) => {
    return form.formState.errors[fieldName] || 
           (asyncErrors[fieldName as string] ? { message: asyncErrors[fieldName as string] } : undefined);
  }, [form.formState.errors, asyncErrors]);

  const isFieldValidating = useCallback((fieldName: keyof T) => {
    return validatingFields.has(fieldName as string);
  }, [validatingFields]);

  const hasAsyncErrors = Object.keys(asyncErrors).length > 0;
  const isAnyFieldValidating = validatingFields.size > 0;

  return {
    ...form,
    getFieldError,
    isFieldValidating,
    hasAsyncErrors,
    isAnyFieldValidating,
    asyncErrors,
    validatingFields,
  };
}

/**
 * Form persistence hook - saves form data to localStorage
 */
export function usePersistedForm<T extends FieldValues>(
  key: string,
  schema: ZodSchema<T>,
  options?: UseFormProps<T>
) {
  const form = useValidatedForm(schema, {
    ...options,
    defaultValues: (() => {
      if (typeof window === 'undefined') return options?.defaultValues;
      
      try {
        const saved = localStorage.getItem(`form-${key}`);
        return saved ? { ...options?.defaultValues, ...JSON.parse(saved) } : options?.defaultValues;
      } catch {
        return options?.defaultValues;
      }
    })(),
  });

  // Save form data on change
  useEffect(() => {
    const subscription = form.watch((data) => {
      try {
        localStorage.setItem(`form-${key}`, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, key]);

  const clearPersistedData = useCallback(() => {
    try {
      localStorage.removeItem(`form-${key}`);
      form.reset(options?.defaultValues);
    } catch (error) {
      console.error('Error clearing persisted form data:', error);
    }
  }, [key, form, options?.defaultValues]);

  return {
    ...form,
    clearPersistedData,
  };
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  url: z.string().url('Please enter a valid URL'),
  apiKey: z.string()
    .min(1, 'API key is required')
    .regex(/^[a-zA-Z0-9\-_]+$/, 'API key contains invalid characters'),
};