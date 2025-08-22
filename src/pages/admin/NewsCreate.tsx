import NewsEditor from '@/components/admin/NewsEditor';

export default function NewsCreate() {
  const handleSave = (newsData) => {
    console.log('Saving news:', newsData);
    // Handle save logic here
  };

  const handleCancel = () => {
    console.log('Cancel create news');
    // Handle cancel logic here
  };

  return (
    <NewsEditor 
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}