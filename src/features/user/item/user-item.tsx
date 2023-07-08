import React, { useEffect, useState } from 'react';
import {Avatar, Card, Divider, Modal, Tabs} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteUserMutation, useGetUserQuery } from '../api/repository';
import './user-item.scss';
import InfoField from '../../../common/components/ui/info-field/info-field';
import CardHeader, { UiButton } from '../../../common/components/ui/card-header/card-header';
import { toast } from 'react-toastify';
import {AndroidOutlined, AppleOutlined} from "@ant-design/icons";

const UserProfile: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useGetUserQuery(+userId!);
  const [deleteUser, { isSuccess: isSuccessDeletion, isError: isErrorDeletion }] = useDeleteUserMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    deleteUser(+userId!);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const cardActionButtons: UiButton[] = [
    {
      buttonTitle: 'Delete',
      callback: showModal,
      danger: true,
    },
  ];

  useEffect(() => {
    if (isSuccessDeletion) {
      toast.success(`${user?.name || 'user'} successfully deleted!`);
      setIsModalOpen(false);
      navigate('/users');
    }
    if (isErrorDeletion) {
      toast.error('Some error during user deletion!');
    }
  }, [isSuccessDeletion, isErrorDeletion]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while loading user?.</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <Card
      title={
        <CardHeader
          title={`User @${user?.username}`}
          backBtnLink="/users"
          isBackBtnVisible={true}
          buttons={cardActionButtons}
        />
      }
      style={{ width: '100%' }}
    >
      <div className="user-info">
        <div className="user-info__avatar">
          <Avatar src={'data:image/jpeg;base64,' + user?.photos[0].photoLob} size={190} />
          <span className="flag-icon">{user?.language?.emoji}</span>
        </div>
        <div className="user-info__details">
          <div className="user-info__row">
            <InfoField title="Name" text={user?.name} />
            <InfoField title="Age" text={user?.age} />
            <InfoField title="Sex" text={user?.sex} />
            <InfoField title="City" text={user?.city} />
            <InfoField title="Target sex" text={user?.targetSex} />
            <InfoField title="Search type" text={user?.communicationForm} />
          </div>
          <div className="user-info__row fullwidth">
            <InfoField title="Purpose of dating" text={user?.purposeOfDating} />
            <InfoField title="Description" text={user?.description || 'No description'} />
          </div>
        </div>
      </div>
      <div>
        <Divider orientation="right">Event history</Divider>
      </div>
      <Modal title="User deletion" centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure you want to delete {user?.name || 'this user'} ?</p>
      </Modal>
    </Card>
  );
};

export default UserProfile;
