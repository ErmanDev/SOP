import { Layout, LayoutBody, LayoutHeader } from '@/components/layouts';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserHeader } from '@/components/user-header';
import Cookies from 'js-cookie';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const LayoutPage = ({ children }: { children: ReactNode }) => {
  const capitalizeWords = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const firstName = capitalizeWords(Cookies.get('firstName') ?? 'User');

  return (
    <Layout className="bg-waves">
      <LayoutHeader>
        <SidebarTrigger className="-ml-1" />
        <UserHeader
          headerName={
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to={'/dashboard-app'}
                      className="font-light text-[#927B6B]"
                    >
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to={'../users'}
                      className="font-light text-[#927B6B]"
                    ></Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbPage className="text-[#492309]">
                  Welcome, {firstName}
                </BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />
      </LayoutHeader>
      <LayoutBody>{children}</LayoutBody>
    </Layout>
  );
};

export default LayoutPage;
