import AdminPageContentEditor from '../AdminPageContentEditor';
import { sectionConfig } from '../sectionConfig';

const AdminPageCharity = () => {
    return <AdminPageContentEditor pageName="charity" pageTitle="Charity Page" sections={sectionConfig.charity || []} />;
};

export default AdminPageCharity;
