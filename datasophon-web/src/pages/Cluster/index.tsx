import { useParams, useNavigate } from 'react-router-dom'
import { Button, Space, Dropdown, App, Row, Col } from 'antd'
import { PageContainer, ProCard } from '@ant-design/pro-components'
import { EllipsisOutlined } from '@ant-design/icons'
import useSearchParams from '../../hooks/useSearchParams'
import { APIS } from '../../services/cluster'
import { useCallback, useEffect, useState } from 'react'

type CLusterType = {
    id: number;
    serviceName: string;
    serviceStateCode: number;
}

const Cluster = () => {
    const { clusterId } = useParams()
    const clusterName = useSearchParams('clusterName')
    const [clusterList, setClusterList] = useState<Array<CLusterType>>()
    const { message } = App.useApp()
    const navigate = useNavigate()
    const handleOnClick = () => {
        navigate('/cluster/1/host')
    }
    const handleOnServiceClick = (id: number, serviceName: string) => {
        // TODO: 暂时以页面的形式跳转，后期需改造为 double click 弹窗的形式
        navigate(`/cluster/${clusterId}/service/${id}?serviceName=${serviceName}`)
    }

    const clusterServiceList =useCallback(async (clusterId:string) => {
        const { code, data, msg } = await APIS.ClusterApi.clusterServiceList({clusterId})
        if (code === 200) {
            setClusterList(data)
        } else {
            message.error(msg)
        }
    }, [message])

    useEffect(()=> {
        if (clusterId) {
            clusterServiceList(clusterId)
        }
        // TODO: // 容错处理
    }, [clusterId, clusterServiceList])

    return (<PageContainer
        title={clusterName}
        header={{
            // 缺一个面包屑导航
            extra: [
                <Button type="primary" key="1" onClick={handleOnClick}>主机管理</Button>,
                <Button type="primary" key="2" onClick={() => {
                    navigate(`/cluster/${clusterId}/alarm`)
                }}>告警管理</Button>,
                <Button type="primary" key="3" onClick={() => {
                    navigate(`/cluster/${clusterId}/system`)
                }}>系统管理</Button>
            ]
        }}
        >
            <Row gutter={[16, 16]} justify={'center'}>
                {
                    clusterList?.map((item) => {
                        return (
                            <Col>
                                <ProCard 
                                    key={item.id}
                                    bordered
                                    style={{ width: 220 }}
                                    onClick={() => {
                                    handleOnServiceClick(item.id, item.serviceName)
                                }}>
                                    <div>{item.serviceName}</div>
                                </ProCard>
                            </Col>
                            
                        )
                    })
                }
            </Row>
            <Space>
                
            </Space>
        </PageContainer>)
}

export default Cluster