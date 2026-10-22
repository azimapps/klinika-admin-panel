import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomTabs } from 'src/components/custom-tabs';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

import { StaffFormDialog } from './staff-form-dialog';
import { staffTableColumns } from './staff-table-columns';
import { useGetStaff, useBlockStaff, useUnblockStaff } from '../hooks';
import { StaffResetPasswordDialog } from './staff-reset-password-dialog';

import type { StaffRole, IStaffUser, IStaffListParams } from '../types';

// ----------------------------------------------------------------------

const ROLE_TABS: Array<{ value: StaffRole | 'all'; label: string }> = [
  { value: 'all', label: 'all' },
  { value: 'operator', label: 'operator' },
  { value: 'senior_operator', label: 'senior_operator' },
  { value: 'administrator', label: 'administrator' },
];

export function StaffListView() {
  const { t } = useTranslate('staff');
  const { user } = useAuthContext();
  const currentUserId = user?.sub ? Number(user.sub) : undefined;

  const [roleTab, setRoleTab] = useState<StaffRole | 'all'>('all');

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IStaffUser | undefined>(undefined);
  const [openReset, setOpenReset] = useState(false);
  const [resetUser, setResetUser] = useState<IStaffUser | undefined>(undefined);

  const params: IStaffListParams = { ...(roleTab !== 'all' && { role: roleTab }) };
  const { data: staff = [], isLoading } = useGetStaff(params);

  const blockStaff = useBlockStaff();
  const unblockStaff = useUnblockStaff();

  const handleOpenForm = useCallback((row?: IStaffUser) => {
    setSelectedRow(row);
    setOpenForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setSelectedRow(undefined);
    setOpenForm(false);
  }, []);

  const handleResetPassword = useCallback((row: IStaffUser) => {
    setResetUser(row);
    setOpenReset(true);
  }, []);

  const handleToggleBlock = useCallback(
    (row: IStaffUser) => {
      if (row.is_active) {
        blockStaff.mutate(row.id);
      } else {
        unblockStaff.mutate(row.id);
      }
    },
    [blockStaff, unblockStaff]
  );

  const columns = staffTableColumns({
    t,
    currentUserId,
    onEdit: handleOpenForm,
    onToggleBlock: handleToggleBlock,
    onResetPassword: handleResetPassword,
  });

  return (
    <RoleBasedGuard hasContent currentRole={user?.role || ''} allowedRoles="administrator">
      <DashboardContent>
        <CustomBreadcrumbs
          heading={t('list_title')}
          links={[{ name: t('main'), href: paths.dashboard.root }, { name: t('staff') }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => handleOpenForm()}
            >
              {t('create')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <CustomTabs
            value={roleTab}
            onChange={(_, v) => setRoleTab(v)}
            sx={{ px: 2.5, pt: 1 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {ROLE_TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.value === 'all' ? t('all_roles') : t(`role_${tab.label}`)}
              />
            ))}
          </CustomTabs>

          <Box sx={{ position: 'relative' }}>
            <DataGridCustom<IStaffUser>
              data={staff}
              column={columns}
              loading={isLoading}
              rowCount={staff.length}
              quickToolbar={false}
              checkboxSelection={false}
            />
          </Box>
        </Card>

        <StaffFormDialog open={openForm} onClose={handleCloseForm} currentRow={selectedRow} />

        <StaffResetPasswordDialog
          open={openReset}
          onClose={() => setOpenReset(false)}
          user={resetUser}
        />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
