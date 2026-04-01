import AdminPageContentEditor from '../AdminPageContentEditor';
import { sectionConfig } from '../sectionConfig';

const AdminPageVisitors = () => {
    return <AdminPageContentEditor pageName="visitors" pageTitle="Visitors Page" sections={sectionConfig.visitors || []} />;
};

export default AdminPageVisitors;
