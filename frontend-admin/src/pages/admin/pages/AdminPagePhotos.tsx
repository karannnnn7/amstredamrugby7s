import AdminPageContentEditor from '../AdminPageContentEditor';
import { sectionConfig } from '../sectionConfig';

const AdminPagePhotos = () => {
    return <AdminPageContentEditor pageName="photos" pageTitle="Photos Page" sections={sectionConfig.photos || []} />;
};

export default AdminPagePhotos;
