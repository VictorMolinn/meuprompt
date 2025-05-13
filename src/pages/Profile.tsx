import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePromptStore } from '../store/promptStore';
import { supabase } from '../lib/supabase';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, Building, Upload, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { OnboardingFormData } from '../types';

const Profile: React.FC = () => {
  const [formData, setFormData] = useState<OnboardingFormData>({
    full_name: '',
    company_name: '',
    company_description: '',
    brand_voice: '',
    niche_id: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const { user, profile, getProfile } = useAuthStore();
  const { niches, fetchNiches } = usePromptStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchNiches();
    
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        company_name: profile.company_name || '',
        company_description: profile.company_description || '',
        brand_voice: profile.brand_voice || '',
        niche_id: profile.niche_id,
      });
      
      setAvatarUrl(profile.avatar_url);
    }
  }, [user, profile, navigate, fetchNiches]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      await getProfile();
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Ocorreu um erro ao salvar seu perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) {
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    setIsUploading(true);
    
    try {
      // Upload image
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      setAvatarUrl(publicUrl);
      await getProfile();
      toast.success('Avatar atualizado com sucesso!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Ocorreu um erro ao atualizar seu avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-barlow text-gray-800 dark:text-white mb-8">
          Meu Perfil
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={profile?.full_name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              <label 
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-900 text-white p-2 rounded-full cursor-pointer hover:bg-blue-800 transition-colors"
              >
                <Upload size={16} />
              </label>
              <input 
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isUploading}
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-2">
                {formData.full_name || 'Usuário'}
              </h2>
              
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <Mail size={16} className="mr-2" />
                <span>{user?.email}</span>
              </div>
              
              {formData.company_name && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Building size={16} className="mr-2" />
                  <span>{formData.company_name}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome Completo"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              leftIcon={<User size={18} />}
            />
            
            <Input
              label="Nome da Empresa"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Nome da sua empresa"
              leftIcon={<Building size={18} />}
            />
          </div>
          
          <div className="mt-6">
            <label className="block mb-1 font-barlow font-medium text-gray-700 dark:text-gray-300">
              Descrição da Empresa
            </label>
            <textarea
              name="company_description"
              value={formData.company_description}
              onChange={handleChange}
              placeholder="Descreva sua empresa, o que faz, para quem, etc."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring-blue-900 focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-h-32"
            />
          </div>
          
          <div className="mt-6">
            <label className="block mb-1 font-barlow font-medium text-gray-700 dark:text-gray-300">
              Tom de Voz da Marca
            </label>
            <textarea
              name="brand_voice"
              value={formData.brand_voice}
              onChange={handleChange}
              placeholder="Descreva como sua marca se comunica (formal, informal, divertida, técnica, etc.)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring-blue-900 focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-h-32"
            />
          </div>
          
          <div className="mt-6">
            <label className="block mb-1 font-barlow font-medium text-gray-700 dark:text-gray-300">
              Nicho de Atuação
            </label>
            <select
              name="niche_id"
              value={formData.niche_id || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring-blue-900 focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Selecione um nicho</option>
              {niches.map(niche => (
                <option key={niche.id} value={niche.id}>
                  {niche.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mt-8">
            <Button
              onClick={handleSave}
              isLoading={isLoading}
              leftIcon={<Save size={16} />}
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;