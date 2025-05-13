/*
  # Add Niche Branding Fields
  
  1. Changes
    - Add color column to niches table
    - Add display_name column to niches table
    - Update existing niches with default values
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns
ALTER TABLE niches 
ADD COLUMN color text NOT NULL DEFAULT '#4A5568',
ADD COLUMN display_name text NOT NULL DEFAULT '';

-- Update existing niches with meaningful values
UPDATE niches SET 
  color = CASE name
    WHEN 'E-commerce' THEN '#FF5722'
    WHEN 'Saúde e Bem-estar' THEN '#4CAF50'
    WHEN 'Gastronomia' THEN '#FFC107'
    WHEN 'Educação' THEN '#2196F3'
    WHEN 'Tecnologia' THEN '#9C27B0'
    ELSE '#4A5568'
  END,
  display_name = CASE name
    WHEN 'E-commerce' THEN 'MARKETPLACE'
    WHEN 'Saúde e Bem-estar' THEN 'SAÚDE'
    WHEN 'Gastronomia' THEN 'GASTRONOMIA'
    WHEN 'Educação' THEN 'EDUCAÇÃO'
    WHEN 'Tecnologia' THEN 'TECH'
    ELSE ''
  END;