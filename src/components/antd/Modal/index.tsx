import React from 'react';

import { Col, Modal as ModalAntd, Row } from 'antd';
import { Image } from '../Image';

interface ModalProps {
    isModalOpen: boolean;
    hideModal: () => void;
    img?: string | null;
    imgHeight?: number;
    witdh?: number;
    children?: React.ReactNode;
    subChildren?: React.ReactNode;
}

export const Modal = ({ isModalOpen, hideModal, img, imgHeight = 460,witdh = 800, children, subChildren}: ModalProps) => {
    let imageModified;
    if (img !== null || img !== undefined) {
        imageModified = img?.slice(1, -1);
    
        const imageMultipleArr = img?.split('", "') ?? [];
        if (imageMultipleArr?.length > 1) {
            imageModified = img?.split('", "')[1]?.slice(0, -1);
        }
    }

    return (
        <ModalAntd
            centered
            closable={false}
            open={isModalOpen}
            onCancel={hideModal}
            footer={[]}
            width={witdh}
            className="modal-midia">
            <Row>
                <Col span={24} xs={24} sm={12} className='image-modal-col'>
                    <Image src={imageModified} height={imgHeight} />    
                </Col>
                <Col span={24} xs={24} sm={11} className='border-col'>
                    {children}
                </Col>
            </Row>
            <Row>
                {subChildren}
            </Row>
        </ModalAntd>
    )
};