import AdminPageContentEditor from '../AdminPageContentEditor';
import { sectionConfig } from '../sectionConfig';

const AdminPageSustainability = () => {
    return <AdminPageContentEditor pageName="sustainability" pageTitle="Sustainability Page" sections={sectionConfig.sustainability || []} />;
};

export default AdminPageSustainability;
