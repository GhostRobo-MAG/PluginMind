/**
 * User Account Hook - Manage account-level operations like password change and account deletion
 */

import { useState, useCallback } from 'react';
import { userService } from '@/services';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

/**
 * Hook for account security operations
 */
export function useAccountSecurity() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  /**
   * Change user password
   */
  const changePassword = useCallback(async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> => {
    setIsChangingPassword(true);
    try {
      await userService.changePassword(data);

      toast({
        title: 'Password Changed',
        description: 'Your password has been changed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Change Password',
        description: error?.message || 'An error occurred while changing your password.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsChangingPassword(false);
    }
  }, []);

  /**
   * Delete user account (permanent action)
   */
  const deleteAccount = useCallback(async (confirmation: {
    password: string;
    confirmation_text: string;
  }): Promise<void> => {
    setIsDeletingAccount(true);
    try {
      await userService.deleteAccount(confirmation);

      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Delete Account',
        description: error?.message || 'An error occurred while deleting your account.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsDeletingAccount(false);
    }
  }, []);

  return {
    changePassword,
    deleteAccount,
    isChangingPassword,
    isDeletingAccount,
    isLoading: isChangingPassword || isDeletingAccount,
  };
}

/**
 * Password strength validation hook
 */
export function usePasswordValidation() {
  const validatePassword = useCallback((password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;
    
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score < 2) strength = 'weak';
    else if (score < 4) strength = 'medium';
    else if (score < 5) strength = 'strong';
    else strength = 'very-strong';

    const isValid = score >= 4; // At least 4 requirements met

    return {
      requirements,
      score,
      strength,
      isValid,
      message: isValid 
        ? 'Password meets security requirements'
        : 'Password does not meet security requirements',
    };
  }, []);

  const validatePasswordMatch = useCallback((password: string, confirmPassword: string) => {
    return {
      matches: password === confirmPassword,
      message: password === confirmPassword 
        ? 'Passwords match' 
        : 'Passwords do not match',
    };
  }, []);

  return {
    validatePassword,
    validatePasswordMatch,
  };
}

/**
 * Account deletion confirmation hook
 */
export function useAccountDeletion() {
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [confirmationData, setConfirmationData] = useState({
    password: '',
    confirmation_text: '',
    understand_consequences: false,
    backup_data: false,
  });

  const router = useRouter();
  const { deleteAccount, isDeletingAccount } = useAccountSecurity();

  const updateConfirmationData = useCallback((updates: Partial<typeof confirmationData>) => {
    setConfirmationData(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setConfirmationStep(prev => Math.min(prev + 1, 2));
  }, []);

  const prevStep = useCallback(() => {
    setConfirmationStep(prev => Math.max(prev - 1, 0));
  }, []);

  const resetConfirmation = useCallback(() => {
    setConfirmationStep(0);
    setConfirmationData({
      password: '',
      confirmation_text: '',
      understand_consequences: false,
      backup_data: false,
    });
  }, []);

  const canProceedStep1 = confirmationData.understand_consequences && confirmationData.backup_data;
  const canProceedStep2 = confirmationData.confirmation_text.trim().toUpperCase() === 'DELETE ACCOUNT';
  const canDelete = confirmationData.password.length > 0 && canProceedStep2;

  const executeAccountDeletion = useCallback(async () => {
    if (!canDelete) return;

    try {
      await deleteAccount({
        password: confirmationData.password,
        confirmation_text: confirmationData.confirmation_text,
      });

      // Redirect to home page after successful deletion
      router.push('/');
    } catch (error) {
      // Error handling is done in useAccountSecurity
      throw error;
    }
  }, [canDelete, deleteAccount, confirmationData, router]);

  const steps = [
    {
      title: 'Understand Consequences',
      description: 'Please review what will happen when you delete your account.',
      canProceed: canProceedStep1,
    },
    {
      title: 'Confirm Deletion',
      description: 'Type "DELETE ACCOUNT" to confirm you want to permanently delete your account.',
      canProceed: canProceedStep2,
    },
    {
      title: 'Enter Password',
      description: 'Enter your current password to complete account deletion.',
      canProceed: canDelete,
    },
  ];

  return {
    confirmationStep,
    confirmationData,
    steps,
    updateConfirmationData,
    nextStep,
    prevStep,
    resetConfirmation,
    executeAccountDeletion,
    canProceedStep1,
    canProceedStep2,
    canDelete,
    isDeletingAccount,
  };
}

/**
 * Combined account management hook
 */
export function useAccountManagement() {
  const security = useAccountSecurity();
  const passwordValidation = usePasswordValidation();
  const accountDeletion = useAccountDeletion();

  return {
    // Security operations
    changePassword: security.changePassword,
    isChangingPassword: security.isChangingPassword,
    
    // Password validation
    validatePassword: passwordValidation.validatePassword,
    validatePasswordMatch: passwordValidation.validatePasswordMatch,
    
    // Account deletion
    deleteAccount: accountDeletion.executeAccountDeletion,
    isDeletingAccount: accountDeletion.isDeletingAccount,
    deletionConfirmation: accountDeletion,
    
    // Combined loading state
    isLoading: security.isLoading || accountDeletion.isDeletingAccount,
  };
}