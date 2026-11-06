import { loadData } from '../../../lib/admin/data';
import { Dashboard } from '../Views';
import { countNewRequests } from '../../../lib/admin/requests';
export default async function Page(){
  const [data,newRequests]=await Promise.all([loadData(),countNewRequests()]);
  return <Dashboard data={data} newRequests={newRequests}/>;
}
