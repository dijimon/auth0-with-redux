import React, { Component, Fragment } from 'react'
import { ChartCard, MiniBar, MiniArea, Pie } from 'ant-design-pro/lib/Charts'
import moment from 'moment'
import { Card, Row, Col, Icon } from 'antd';
import numeral from 'numeral';
import './styles.css'

class PeerDashboard extends Component {

    render() {

        // a portion of mock data
        const visitData = [];
        const beginDay = moment().subtract(30, 'days');
        for (let i = 0; i < 20; i += 1) {
          visitData.push({
            x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('YYYY-MM-DD'),
            y: Math.floor(Math.random() * 100) + 10,
          });
        }
        const salesPieData = [
            {
              x: 'Running',
              y: 58,
            },
            {
              x: 'Pending',
              y: 48,
            },
            {
              x: 'Deleted',
              y: 12,
            },
            {
              x: 'In process',
              y: 29,
            },
            {
              x: 'Failed',
              y: 22,
            },
            {
                x: 'Not running',
                y: 35,
            }
        ];

        return (
            <Fragment>
            <Row style={{display: 'flex', justifyContent: 'space-between'}}>            
                <Col span={6} className='dashboardCardItem'>
                    <ChartCard
                        title='Peers created'
                        avatar={
                            <Icon className='cardIcon rotate lightGreen' type='plus' />
                        }
                        total={numeral(204).format('0,0')}
                      />
                </Col>
                <Col span={6} className='dashboardCardItem'>
                    <ChartCard
                        title='Peers failed'
                        avatar={
                            <Icon className='cardIcon rotate lightRed' type='close' />
                        }
                        total={numeral(22).format('0,0')}
                    />
                </Col>
                <Col span={6} className='dashboardCardItem'>
                    <ChartCard
                        title='Peers running'
                        avatar={
                            <Icon className='cardIcon rotate lightViolet' type='rise' />
                        }
                        total={numeral(58).format('0,0')}
                    />
                </Col>
                <Col span={6} className='dashboardCardItem'>
                    <ChartCard
                        title='Peers pending'
                        avatar={
                            <Icon className='cardIcon rotate lightBlue' type='sync' />
                        }
                        total={numeral(48).format('0,0')}
                        />
                </Col>
            </Row>
            {/* <Row style={{display: 'flex', justifyContent: 'space-between', marginTop: 5}}>
            <Col span={6} style={{ marginRight: 5 }}>
                    <Card className='itemPieChart' title='Peers created'>
                        <Pie percent={100} total='100%' />
                    </Card>
                </Col>
                <Col span={6} style={{ marginRight: 5 }}>
                    <Card className='itemPieChart' title='Peers failed'>
                        <Pie percent={(22*100)/204} total='14%' />
                    </Card>
                </Col>
                <Col span={6} style={{ marginRight: 5 }}>
                    <Card className='itemPieChart' title='Peers running'>
                        <Pie percent={(58*100)/204} total='45%' />
                    </Card>
                </Col>
                <Col span={6} style={{ marginRight: 5 }}>
                    <Card className='itemPieChart' title='Peers pending'>
                        <Pie percent={(48*100)/204} total='37%' />
                    </Card>
                </Col>
            </Row> */}
            <Row style={{display: 'flex', marginTop: 5}}>
                <Col span={12} style={{width: '50.5%'}}>
                    <Card title='Peers statuses for the all period'>
                        <Pie
                          hasLegend
                          total={() => (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: salesPieData.reduce((pre, now) => now.y + pre, 0)
                              }}
                            />
                          )}
                          data={salesPieData}
                          valueFormat={val => <span dangerouslySetInnerHTML={{ __html: val }} />}
                          height={140}
                        />
                    </Card>
                </Col>
                <Col span={12} style={{display: 'flex', flexDirection: 'column', marginLeft: 5, marginRight: 0, width: '50.5%', height: '100%'}}>
                <Card title='Peers creation per day'>
                    <MiniBar
                        data={visitData}
                    />
                </Card>
                <Card style={{marginTop: 5}} title='Peers creation for all the period'>
                <MiniArea
                    line
                    color='#cceafe'
                    data={visitData}
                /> 
                </Card>
            </Col>
            </Row>
        </Fragment>
        );
    }
}

export default PeerDashboard