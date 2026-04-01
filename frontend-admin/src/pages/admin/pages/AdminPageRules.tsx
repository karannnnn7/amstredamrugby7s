import AdminPageContentEditor from '../AdminPageContentEditor';
import { sectionConfig } from '../sectionConfig';

const AdminPageRules = () => {
    return <AdminPageContentEditor pageName="rules" pageTitle="Rules Page" sections={sectionConfig.rules || []} />;
};

export default AdminPageRules;
