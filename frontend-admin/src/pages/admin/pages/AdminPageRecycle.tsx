import AdminPageContentEditor from '../AdminPageContentEditor';
import { sectionConfig } from '../sectionConfig';

const AdminPageRecycle = () => {
    return <AdminPageContentEditor pageName="recycle" pageTitle="Recycle Page" sections={sectionConfig.recycle || []} />;
};

export default AdminPageRecycle;
