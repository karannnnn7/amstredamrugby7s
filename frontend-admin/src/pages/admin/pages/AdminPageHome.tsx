import AdminPageContentEditor from '../AdminPageContentEditor';
import { sectionConfig } from '../sectionConfig';

const AdminPageHome = () => {
    return <AdminPageContentEditor pageName="home" pageTitle="Home Page" sections={sectionConfig.home || []} />;
};

export default AdminPageHome;
