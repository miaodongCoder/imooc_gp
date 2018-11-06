
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    RefreshControl,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import DataRepository from '../expand/dao/DataRepository';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import RepositoryCell from '../common/RepositoryCell';

const URL='https://api.github.com/search/repositories?q='
const QUERY_STR='&sort=stars'

export default class PopularPage extends Component{

    render(){
        return <View style={styles.container}>
            <NavigationBar
                title={'最热'}
                // style={{backgroundColor:'#6495ED'}}
                statusBar={{
                    backgroundColor:'#2196F3'
                }}
            />
            <ScrollableTabView
                renderTabBar={() => <ScrollableTabBar/>}
                tabBarBackgroundColor="#2196F3"
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                tabBarUnderlineStyle={{backgroundColor:'#e7e7e7', height:2}}
            >
                <PopularTab tabLabel='Java'>JAVA</PopularTab>
                <PopularTab tabLabel='IOS'>IOS</PopularTab>
                <PopularTab tabLabel='ANDROID'>android</PopularTab>
                <PopularTab tabLabel='JAVASCRIPT'>js</PopularTab>
            </ScrollableTabView>

        </View>
    }
}

class PopularTab extends Component{
    constructor(props){
        super(props);
        this.dataRespository = new DataRepository();
        this.state = {
            result:'',
            dataSource: new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2}),
            isLoading:false,
        }
    }

    componentDidMount(){
        this.loadData();
    }

    loadData(){
        this.setState({
            isLoading:true
        })
        let url = URL+this.props.tabLabel+QUERY_STR;
        this.dataRespository
            .fetchNetRepository(url)
            .then(result=>{
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.items),
                    // result:JSON.stringify(result),
                    isLoading:false
                })
            })
            .catch(error=>{
                console.log(error);
            })
    }

    renderRow(data){
        return <RepositoryCell data={data}/>
    }

    render(){
        return <View style={{flex:1}}>
            <ListView dataSource={this.state.dataSource}
                      renderRow={(data)=>this.renderRow(data)}
                      refreshControl={<RefreshControl
                          refreshing={this.state.isLoading}
                          onRefresh={()=>this.loadData()}
                          colors={['#2196F3']}
                          tintColor={'#2196F3'}
                          title={'Loading...'}
                          titleColor={'#2196F3'}
                      />}
            />
        </View>
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'red'
    },
    tips: {
        fontSize:29
    }
})