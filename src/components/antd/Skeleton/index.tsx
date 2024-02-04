import { Card, List, Skeleton } from 'antd';

export const ListMidiaSkeleton = () => {
    const listData = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        title: `midia ${i + 1}`,
    }));

    return (<>
        <List
            itemLayout='vertical'
            dataSource={listData}
            grid={{
                gutter: 2,
                xs: 2,
                sm: 3,
                md: 4,
                lg: 5,
                xl: 5,
                xxl: 8,
            }}
            pagination={{
                defaultPageSize: 30,
                position: 'both',
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            renderItem={(item) => (
                <List.Item className="list-item" key={`${item.id}_listitem`}>
                    <Card hoverable
                        key={`${item.id}_card`}
                        style={{ height: 300, width: '90%' }}
                        cover={<>
                            <div className='container'>
                                <Skeleton.Image active={true} style={{ height: 280, width: 150 }} />
                            </div>
                        </>}>
                    </Card>
                </List.Item>
            )}
        />
    </>)
}