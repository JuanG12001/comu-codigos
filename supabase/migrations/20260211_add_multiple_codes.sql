-- Add new columns for multiple codes
ALTER TABLE community_codes 
ADD COLUMN code_1 text,
ADD COLUMN code_2 text,
ADD COLUMN code_3 text;

-- Optional: Migrate existing data (assuming 'user_code' was the old column)
-- UPDATE community_codes SET code_1 = user_code;

-- Optional: Remove old column after migration
-- ALTER TABLE community_codes DROP COLUMN user_code;
