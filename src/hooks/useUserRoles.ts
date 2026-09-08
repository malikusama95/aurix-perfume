import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

export type AppRole = 'admin' | 'moderator' | 'user';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  updated_at: string;
}

export const useUserRoles = () => {
  const { user, isAdmin } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch current user's roles
  useEffect(() => {
    if (user) {
      fetchUserRoles();
    }
  }, [user]);

  const fetchUserRoles = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user roles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, role: AppRole) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can assign roles",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role
        });
        
      if (error) throw error;

      // Log admin action for audit trail
      console.log(`Admin ${user?.email} assigned role ${role} to user ${userId}`);
      
      toast({
        title: "Role Assigned",
        description: `Successfully assigned ${role} role to user`
      });
      
      await fetchUserRoles();
      return true;
    } catch (error) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive"
      });
      return false;
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can remove roles",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
        
      if (error) throw error;

      // Log admin action for audit trail
      console.log(`Admin ${user?.email} removed role ${role} from user ${userId}`);
      
      toast({
        title: "Role Removed",
        description: `Successfully removed ${role} role from user`
      });
      
      await fetchUserRoles();
      return true;
    } catch (error) {
      console.error("Error removing role:", error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive"
      });
      return false;
    }
  };

  const hasRole = (role: AppRole): boolean => {
    return userRoles.some(userRole => userRole.role === role);
  };

  const getAllUserRoles = async () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can view all user roles",
        variant: "destructive"
      });
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          profiles:user_id (
            email,
            first_name,
            last_name
          )
        `);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching all user roles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user roles",
        variant: "destructive"
      });
      return [];
    }
  };

  return {
    userRoles,
    loading,
    assignRole,
    removeRole,
    hasRole,
    getAllUserRoles,
    refetch: fetchUserRoles
  };
};