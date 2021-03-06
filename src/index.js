import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ListView,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { StackNavigator } from 'react-navigation';


class Beyit extends React.Component {
  render() {
    return (
        <View>
          <Text style={ {fontSize: 15,} }>{this.props.beyit[0]}{"\n"}</Text>
          <Text style={ {fontSize: 15,} }>{this.props.beyit[1]}{"\n"}</Text>
        </View>
  )
  }
}


class Sozluk extends React.Component {

  constructor() {
    super()
    this.state = {
      sozlukVisible: false,
    }
  }

  render() {



    return (
        <View>
          {this.renderInfoButton(this.props.sozluk.length)}
          {this.renderSozluk(this.props.sozluk)}
          <View style={styles.separator}/>
        </View>
    )
  }

  renderInfoButton(length) {
    if (length) {
      return (
          <TouchableOpacity onPress={() => this.toggleSozlukVisible()}><Text>ⓘ{"\n"}</Text></TouchableOpacity>
      )
    }
  }

  renderSozluk(sozluk) {
    if (this.state.sozlukVisible) {
      let wordsCount = 0;
      let words = sozluk.map((k) => {
          return (
              <Text  key={wordsCount++} style={{fontSize: 12, }}><Text style={{fontWeight: 'bold'}}>{k.a}</Text>{k.b}{"\n"}</Text>
          )
      })
      return words;
    }
  }

  toggleSozlukVisible() {
    sozlukVisible = !this.state.sozlukVisible;
    this.setState({sozlukVisible});
  }
}


class Siir extends React.Component {
  render() {
    return (
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 15,}}>{this.props.siir.id}{"\n"}</Text>
          <Beyit beyit={this.props.siir.beyit}/>
          <Sozluk sozluk={this.props.siir.sozluk}/>
        </View>
    )
  }
}

class Poem extends React.Component {
  render() {

    poemView = this.props.poem.siir.map((siir) => {
      return <Siir key={siir.id} siir={siir}/>
    })

    return (
      <View>
        <Text style={{fontSize: 10,}}>{this.props.poem.vezin}</Text>
        {poemView}
      </View>

    )
  }
}

class PoemScreen extends React.Component {

  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);

    this.state = {
      sozlukVisible: [],
    }

  }

  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.poem.siir[0].beyit[0],
  });

  componentDidMount() {
  }

  render() {
    // The screen's current route is passed in to `props.navigation.state`:
    const { params } = this.props.navigation.state;

    return (
        <ScrollView>
          <View select style={styles.container}>
            <Poem poem={params.poem}/>
          </View>
        </ScrollView>
    );
  }
}

const SectionHeader = (props) => (
    <View style={styles.container}>
      <Text style={styles.text}>{props.character}</Text>
      <View style={styles.separator}/>
    </View>
);

class FihristScreen extends Component {

  constructor(props) {
    super(props);

    const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
    const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
      getSectionData,
      getRowData,
    });


    var demoData = require('./data/divan.json').divan;

    const { dataBlob, sectionIds, rowIds } = this.formatData(demoData);
    this.state = {
      dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
    };
  }


  componentDidMount() {
    // require the module
// get a list of files and directories in the main bundle

  }

  static navigationOptions = {
    title: 'Divan',
  }

  render() {

    const { navigate } = this.props.navigation;

    const myRender = (data) => (
        <View style={{flex: 1, flexDirection: 'row', }}>
          <Text selectable={true} style={styles.item} onPress={() => navigate('Poem', { poem: data })}>
            <Text selectable={true} style={{fontWeight: 'bold', }}>{data.id}{"\t"}</Text>
            <Text selectable={true}>{data.siir[0].beyit[0]}</Text>
          </Text>
        </View>
    );

    return (
        <ListView
            dataSource={this.state.dataSource}
            renderRow={myRender}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
        />

    );
  }

  formatData(data) {
    // We're sorting by alphabetically so we need the alphabet
    const alphabet = 'elif,be,pe,te,çe,ra,za,sin,şın,gayn,kaf,kef,lam,mim,nun,vav,ya'.split(',');

    // Need somewhere to store our data
    const dataBlob = {};
    const sectionIds = [];
    const rowIds = [];

    // Each section is going to represent a letter in the alphabet so we loop over the alphabet
    for (let sectionId = 0; sectionId < alphabet.length; sectionId++) {
      // Get the character we're currently looking for
      const currentChar = alphabet[sectionId];

      // Get users whose first name starts with the current letter
      const poems = data.filter((poem) => poem.tag.indexOf(currentChar) === 0);

      // If there are any users who have a first name starting with the current letter then we'll
      // add a new section otherwise we just skip over it
      if (poems.length > 0) {
        // Add a section id to our array so the listview knows that we've got a new section
        sectionIds.push(sectionId);

        // Store any data we would want to display in the section header. In our case we want to show
        // the current character
        dataBlob[sectionId] = { character: currentChar };

        // Setup a new array that we can store the row ids for this section
        rowIds.push([]);

        // Loop over the valid users for this section
        for (let i = 0; i < poems.length; i++) {
          // Create a unique row id for the data blob that the listview can use for reference
          const rowId = `${sectionId}:${i}`;

          // Push the row id to the row ids array. This is what listview will reference to pull
          // data from our data blob
          rowIds[rowIds.length - 1].push(rowId);

          // Store the data we care about for this row
          dataBlob[rowId] = poems[i];
        }
      }
    }

    return { dataBlob, sectionIds, rowIds };

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    paddingBottom: 20,
  },
  text: {
    fontSize: 23,
  },
  item: {
    fontSize: 15,
    paddingLeft: 8,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});

const MainScreen = StackNavigator({
  Fihrist: { screen: FihristScreen },
  Poem: { screen: PoemScreen },
});

export default class Divan extends React.Component {
  render() {
    return (
        <MainScreen/>
    )
  }
}
