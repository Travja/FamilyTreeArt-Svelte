import { TreeArtConfig, TreeArtPage, TreeType } from './TreeArtConfig';
import { get } from 'svelte/store';
import { page } from '$lib/pages.svelte';
import { selections, selectItem } from '../interpreter';
import type { BaseData } from '../../types/data';
import type { ButtonOption } from '../../types/options';
import { MultiSelectData } from '$lib/multi-select';

const config: TreeArtConfig = new TreeArtConfig();

/** Page 1 - Tree Type **/
config.addPage(
  new TreeArtPage({
    title: 'Who do you want your custom family tree art to feature?',
    intro:
      '<a href="https://customfamilytreeart.com/updates"><strong>*Do you want to update an existing tree?</strong></a>',
    options: [
      {
        name: '',
        id: 'type',
        type: 'image',
        //layer: 2,
        required: true,
        images: [
          {
            displayText:
              '<h3>Ancestors</h3><br/>The Trunk is a Couple or Individual, and the Branches are their Ancestors',
            displayImage: '/imgs/Option Examples/ANCESTRY Example.jpg',
            img: {
              type: TreeType.ANCESTRY,
              default: {
                couple: 'Couple'
              }
            },
            reset: ['roots', 'generations'],
            key: 'ancestry'
          },
          {
            displayText:
              '<h3>Descendants</h3><br/>The Branches are the Descendants of the Trunk Couple or Individual',
            displayImage: '/imgs/Option Examples/DESCENDANT Example.jpg',
            key: 'descendant',
            img: {
              type: TreeType.DESCENDANT,
              couple: 'reset'
            },
            reset: ['roots', 'generations', 'ancType']
          },
          {
            group: {
              id: 'both',
              header: '<h3>Both</h3>',
              images: [
                {
                  displayText: 'Descendant Tree with Ancestor Roots',
                  displayImage:
                    '/imgs/Option Examples/DESCENDANT TREE with 2 Gen ANCESTOR ROOTS.jpg',
                  key: 'descendant_roots',
                  img: {
                    type: TreeType.DESCENDANT,
                    couple: 'reset',
                    use: 'roots',
                    roots: {
                      type: TreeType.ANCESTRY,
                      gen: '2 Gen'
                    }
                  },
                  reset: ['ancType']
                },
                {
                  displayText: 'Ancestor Tree with Descendant Roots',
                  displayImage:
                    '/imgs/Option Examples/Ancestry Tree with Descendant Roots.jpg',
                  key: 'ancestry_roots',
                  img: {
                    type: TreeType.ANCESTRY,
                    use: 'roots',
                    roots: {
                      type: TreeType.DESCENDANT,
                      gen: '2 Gen'
                    },
                    default: {
                      couple: 'Couple',
                      gen: '3 Gen'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  })
);
/** Page 1.5 - Ancestry Type **/
config.addPage(
  new TreeArtPage({
    title: 'Ancestry - What type?',
    intro: 'Ancestry trees can be done as a couple or individual.',
    prereq: {
      option: 'type',
      value: ['ancestry', 'ancestry_roots']
    },
    options: [
      {
        name: '',
        id: 'ancType',
        required: true,
        // layer: 2,
        type: 'image',
        images: [
          {
            displayText:
              '<h3>Couple</h3><br/><span>The trunk is a couple' +
              '<br/>The tree has ancestors of both people</span>',
            key: 'ancestry_couple',
            summaryText: 'Ancestry Type: Couple',
            img: {
              couple: 'Couple',
              default: {
                gen: '3 Gen'
              }
            },
            reset: ['generations']
          },
          {
            displayText:
              '<h3>Individual</h3><br/><span>The trunk is an individual' +
              '<br/>The tree has ancestors of one person</span>',
            key: 'ancestry_individual',
            summaryText: 'Ancestry Type: Individual',
            img: {
              couple: 'Individual'
            },
            reset: ['generations']
          }
        ]
      }
    ]
  })
);
/** Page 2 - Generations **/
config.addPage(
  new TreeArtPage({
    //Page 2
    title: 'How many generations do you want to include in your tree?',
    intro:
      'If you want to include more generations, or if you want a different arrangement click <a target="_blank" href="https://customfamilytreeart.com/additional-designs">here.</a>',
    footer: '<b>*You will choose a print type and size in a later step</b>',
    options: [
      {
        name: '',
        required: true,
        layer: 2,
        id: 'generations',
        type: 'image',
        images: [
          {
            prereq: {
              //Ancestry
              option: 'type',
              value: ['ancestry', 'ancestry_roots']
            },
            displayText:
              '<h3>3 Generations</h3>' +
              'Trunk: Main Couple or Individual<br/>' +
              '1st Branches: Parents<br/>' +
              '2nd Branches: Grandparents',
            summaryText: 'Ancestry - 3 Generation',
            cost: 40,
            key: 'ancestry_3gen',
            footer: '<strong>$40&nbsp;creation fee*</strong>',
            img: {
              gen: '3 Gen'
            }
          },
          {
            prereq: {
              //Ancestry
              option: 'type',
              value: ['ancestry', 'ancestry_roots'],
              and: {
                option: 'ancType',
                value: ['ancestry_individual']
              }
            },
            displayText:
              '<h3>4 Generations</h3>' +
              'Trunk: Individual<br/>' +
              '1st Branches: Parents<br/>' +
              '2nd Branches: Grandparents<br/>' +
              '3rd Branches: Great-Grandparents',
            summaryText: 'Ancestry - 4 Generation',
            cost: 40,
            key: 'ancestry_4gen',
            footer: '<strong>$40&nbsp;creation fee*</strong>',
            img: {
              gen: '4 Gen'
            }
          },
          {
            prereq: {
              //Ancestry
              option: 'type',
              value: ['ancestry', 'ancestry_roots'],
              and: {
                option: 'ancType',
                value: ['ancestry_couple']
              }
            },
            displayText:
              '<h3>4 Generations</h3>' +
              'Trunk: Main Couple<br/>' +
              '1st Branches: Parents<br/>' +
              '2nd Branches: Grandparents<br/>' +
              '3rd Branches: Great-Grandparents',
            summaryText: 'Ancestry - 4 Generation',
            cost: 50,
            key: 'ancestry_4gen',
            footer: '<strong>$50&nbsp;creation fee*</strong>',
            img: {
              gen: '4 Gen'
            }
          },
          {
            prereq: {
              //Ancestry
              option: 'type',
              value: ['ancestry', 'ancestry_roots'],
              and: {
                option: 'ancType',
                value: ['ancestry_individual']
              }
            },
            displayText:
              '<h3>5 Generations</h3>' +
              'Trunk: Individual<br/>' +
              '1st Branches: Parents<br/>' +
              '2nd Branches: Grandparents<br/>' +
              '3rd Branches: Great-Grandparents<br/>' +
              '4th Branches: Great-Great-Grandparents',
            summaryText: 'Ancestry - 5 Generation Individual',
            cost: 50,
            key: 'ancestry_5gen',
            footer: '<strong>$50&nbsp;creation fee*</strong>',
            img: {
              type: TreeType.ANCESTRY,
              gen: '5 Gen',
              couple: 'Individual'
            }
          },
          {
            prereq: {
              //Descendant
              option: 'type',
              value: ['descendant', 'descendant_roots']
            },
            displayText:
              '<h3>2 Generations</h3>' +
              'Trunk: Main Couple or Individual<br/>' +
              '1st Branches: Children<br/>' +
              '2nd Branches: Information like Birth Dates, Nicknames, Favorite Colors, Personality Traits - anything that represents the children or family.',
            summaryText: 'Descendant - 2 Generation',
            cost: 50,
            key: 'descendant_2gen',
            footer: '<strong>$50&nbsp;creation fee*</strong>',
            img: {
              gen: '2 Gen'
            }
          },
          {
            prereq: {
              //Descendant
              option: 'type',
              value: ['descendant', 'descendant_roots']
            },
            displayText:
              '<h3>3 Generations</h3>' +
              'Trunk: Main Couple or Individual<br/>' +
              '1st Branches: Children<br/>' +
              '2nd Branches: Grandchildren',
            summaryText: 'Descendant - 3 Generation',
            cost: 50,
            key: 'descendant_3gen',
            footer: '<strong>$50&nbsp;creation fee*</strong>',
            img: {
              gen: '3 Gen'
            }
          },
          {
            prereq: {
              //Descendant
              option: 'type',
              value: ['descendant', 'descendant_roots']
            },
            displayText:
              '<h3>4 Generations</h3>' +
              'Trunk: Main Couple or Individual<br/>' +
              '1st Branches: Children<br/>' +
              '2nd Branches: Grandchildren<br/>' +
              '3rd Branches: Great-Grandchildren',
            summaryText: 'Descendant - 4 Generation',
            cost: 60,
            key: 'descendant_4gen',
            footer: '<strong>$60&nbsp;creation fee*</strong>',
            img: {
              gen: '4 Gen'
            }
          }
        ]
      }
    ]
  })
);
/** Page 3 - Roots **/
config.addPage(
  new TreeArtPage({
    title: 'How many generations of roots do you want?',
    intro: '',
    prereq: {
      option: 'type',
      value: ['descendant_roots', 'ancestry_roots']
    },
    options: [
      {
        name: '',
        type: 'image',
        id: 'roots',
        layer: 3,
        required: true,
        images: [
          {
            prereq: {
              option: 'type',
              value: ['descendant_roots']
            },
            displayText:
              '<h3>2 Generations</h3><br/>1st Roots: Parents<br/>2nd Roots: Grandparents',
            footer: '<h4 class="nomargin">$10</h4>',
            summaryText: 'Roots: Ancestry - 2 Generations',
            cost: 10,
            key: '2gen_ancestor',
            img: {
              use: 'roots',
              roots: {
                type: TreeType.ANCESTRY,
                gen: '2 Gen'
              }
            }
          },
          {
            prereq: {
              option: 'type',
              value: ['descendant_roots']
            },
            displayText:
              '<h3>3 Generations</h3><br/>1st Roots: Parents<br/>2nd Roots: Grandparents' +
              '<br/>3rd Roots: Great-Grandparents',
            footer: '<h4 class="nomargin">$20</h4>',
            summaryText: 'Roots: Ancestry - 3 Generations',
            cost: 20,
            key: '3gen_ancestor',
            img: {
              use: 'roots',
              roots: {
                type: TreeType.ANCESTRY,
                gen: '3 Gen'
              }
            }
          },
          {
            prereq: {
              option: 'type',
              value: ['ancestry_roots']
            },
            displayText:
              '<h3>2 Generations</h3><br/>1st Roots: Children<br/>2nd Roots: Grandchildren',
            footer: '<h4 class="nomargin">$10</h4>',
            summaryText: 'Roots: Descendant - 2 Generations',
            cost: 10,
            key: '2gen_descendant',
            img: {
              use: 'roots',
              roots: {
                type: TreeType.DESCENDANT,
                gen: '2 Gen'
              }
            }
          },
          {
            prereq: {
              option: 'type',
              value: ['ancestry_roots']
            },
            displayText:
              '<h3>3 Generations</h3><br/>1st Roots: Children<br/>2nd Roots: Grandchildren' +
              '<br/>3rd Roots: Great-Grandchildren',
            footer: '<h4 class="nomargin">$20</h4>',
            summaryText: 'Roots: Descendant - 3 Generations',
            cost: 20,
            key: '3gen_descendant',
            img: {
              use: 'roots',
              roots: {
                type: TreeType.DESCENDANT,
                gen: '3 Gen'
              }
            }
          }
        ]
      }
    ]
  })
);
/** Page 4 - Date Branches **/
config.addPage(
  new TreeArtPage({
    // Page 4
    title: 'Do you have a small family?',
    intro:
      'Small family trees can be filled out by adding additional branches with birthdates. Wedding dates can also be included.<br/><h4>You can double the number of branches on your tree by adding birthdate branches.</h4><br/>' +
      '<table class="centered"><tr>' +
      '<td>Small Family</td><td>Date Branches Added</td><td>Small Family with Leaves*</td><td>Small Family with dates and Leaves*</td>' +
      '</tr><tr>' +
      '<td><img class="imgOption" src="/imgs/Option Examples/Small Family.jpg" alt="Small Family"/></td>' +
      '<td><img class="imgOption" src="/imgs/Option Examples/Small Family With Dates.jpg" alt="Small Family w/ Dates"/></td>' +
      '<td><img class="imgOption" src="/imgs/Option Examples/Small Family With Leaves.jpg" alt="Small Family w/ Leaves"/></td>' +
      '<td><img class="imgOption" src="/imgs/Option Examples/Small Family With Dates and Leaves.jpg" alt="Small Family w/ Dates + Leaves"/></td>' +
      '</tr><tr><td colspan="2"></td><td colspan="2">*Leaves can be added in a later step.</p></td></table><br/>',
    prereq: {
      option: 'generations',
      value: ['ancestry_4gen', 'descendant_2gen', 'descendant_3gen'],
      or: {
        option: 'generations',
        value: ['ancestry_5gen'],
        and: {
          option: 'ancType',
          value: ['ancestry_individual']
        },
        or: {
          option: 'generations',
          value: ['ancestry_3gen'],
          and: {
            option: 'ancType',
            value: ['ancestry_couple']
          }
        }
      }
    },
    options: [
      {
        name: '<h3>Do you want to add date branches?</h3>',
        id: 'addDateBranches',
        type: 'button',
        buttons: [
          {
            displayText: 'Yes',
            key: 'yes'
          },
          {
            displayText: 'No',
            key: 'no',
            default: true
          }
        ]
      },
      {
        prereq: {
          option: 'addDateBranches',
          value: ['yes']
        },
        required: true,
        name: 'Approximately how many people will be in your tree?&nbsp;&nbsp;',
        type: 'dropdown',
        id: 'branchesAmount',
        items: [
          {
            displayText: '0-20 (Free!)',
            cost: 0,
            summaryText: '0-20 Date Branches',
            formDisplay: '0-20 Branches',
            key: '0-20'
          },
          {
            displayText: '20-30 (+$5)',
            cost: 5,
            summaryText: '20-30 Date Branches',
            formDisplay: '20-30 Branches',
            key: '20-30'
          },
          {
            displayText: '30-40 (+$10)',
            cost: 10,
            summaryText: '30-40 Date Branches',
            formDisplay: '30-40 Branches',
            key: '30-40'
          },
          {
            displayText: '40-50 (+$20)',
            cost: 20,
            summaryText: '40-50 Date Branches',
            formDisplay: '40-50 Branches',
            key: '40-50'
          },
          {
            displayText: '50-70 (+$30)',
            cost: 30,
            summaryText: '50-70 Date Branches',
            formDisplay: '50-70 Branches',
            key: '50-70'
          },
          {
            displayText: '70+ (Contact Us for a Quote)',
            cost: 0,
            summaryText: '70+ Date Branches',
            formDisplay: '70+ Branches',
            key: '70+'
          }
        ]
      }
    ]
  })
);
/** Page 5 - Branch Style **/
config.addPage(
  new TreeArtPage({
    title: 'Which style of branches do you prefer?',
    intro: '',
    options: [
      {
        name: '',
        type: 'image',
        id: 'style',
        layer: 2,
        images: [
          {
            displayText: 'Style 1',
            key: 'style1',
            img: {
              style1: 'Style 1'
            },
            default: true
          },
          {
            displayText: 'Style 2',
            key: 'style2',
            img: {
              style1: 'Style 2'
            }
          }
        ]
      }
    ]
  })
);
/** Page 6 - Tree Style (Chalk?) **/
config.addPage(
  new TreeArtPage({
    //Page 6
    title: 'Which style of tree do you prefer?',
    intro:
      'Need help deciding? Check out more examples <a target="_blank" href="https://customfamilytreeart.com/gallery">here.</a>',
    options: [
      {
        name: '',
        type: 'image',
        id: 'style2',
        layer: 2,
        images: [
          {
            displayText: 'Classic',
            background: 'url("/imgs/Backgrounds/Tan 1.jpg")',
            default: true,
            key: 'classic',
            img: {
              color: 'reset',
              chalk: 'reset'
            },
            reset: ['background']
          },
          {
            displayText: 'Chalk',
            key: 'chalk',
            background: 'url("/imgs/Backgrounds/Chalk 1.jpg")',
            img: {
              color: 'CHALK',
              chalk: ' CHALK',
              background: '/imgs/Backgrounds/Chalk 1.jpg'
            },
            reset: ['fontColor', 'background']
          }
        ]
      }
    ]
  })
);
/** Page 7 - Backgrounds **/
config.addPage(
  new TreeArtPage({
    title: 'Which background do you want?',
    intro: '',
    options: [
      {
        name: '',
        type: 'image',
        id: 'background',
        layer: 1,
        images: [
          {
            prereq: {
              option: 'type',
              value: ['ancestry', 'descendant'],
              and: {
                option: 'style2',
                value: ['classic']
              }
            },
            displayText: 'Sky & Ground',
            displayImage: '/imgs/Backgrounds/Sky & Ground No Roots.jpg',
            img: {
              background: '/imgs/Backgrounds/Sky & Ground No Roots.jpg'
            },
            key: 's&g'
          },
          {
            prereq: {
              option: 'type',
              value: ['ancestry_roots', 'descendant_roots'],
              and: {
                option: 'style2',
                value: ['classic']
              }
            },
            displayText: 'Sky & Ground',
            displayImage: '/imgs/Backgrounds/Sky & Ground w Roots.jpg',
            img: {
              background: '/imgs/Backgrounds/Sky & Ground w Roots.jpg'
            },
            key: 's&g'
          },
          {
            prereq: {
              option: 'type',
              value: ['ancestry', 'descendant'],
              and: {
                option: 'style2',
                value: ['classic']
              }
            },
            displayText: 'Sky & Ground 2',
            displayImage: '/imgs/Backgrounds/Sky & Ground No Roots 2.jpg',
            img: {
              background: '/imgs/Backgrounds/Sky & Ground No Roots 2.jpg'
            },
            key: 's&g2'
          },
          {
            prereq: {
              option: 'type',
              value: ['ancestry_roots', 'descendant_roots'],
              and: {
                option: 'style2',
                value: ['classic']
              }
            },
            displayText: 'Sky & Ground 2',
            displayImage: '/imgs/Backgrounds/Sky & Ground w Roots 2.jpg',
            img: {
              background: '/imgs/Backgrounds/Sky & Ground w Roots 2.jpg'
            },
            key: 's&g2'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Sky Blue 1',
            displayImage: '/imgs/Backgrounds/Sky Blue 1.jpg',
            img: {
              background: '/imgs/Backgrounds/Sky Blue 1.jpg'
            },
            key: 'sky_blue 1'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Sky Blue 2',
            displayImage: '/imgs/Backgrounds/Sky Blue 2.jpg',
            img: {
              background: '/imgs/Backgrounds/Sky Blue 2.jpg'
            },
            key: 'sky_blue 2'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Tan 1',
            displayImage: '/imgs/Backgrounds/Tan 1.jpg',
            img: {
              background: '/imgs/Backgrounds/Tan 1.jpg'
            },
            key: 't1'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Tan 2',
            displayImage: '/imgs/Backgrounds/Tan 2.jpg',
            img: {
              background: '/imgs/Backgrounds/Tan 2.jpg'
            },
            key: 't2'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Tan 3',
            displayImage: '/imgs/Backgrounds/Tan 3.jpg',
            img: {
              background: '/imgs/Backgrounds/Tan 3.jpg'
            },
            key: 't3'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Tan 4',
            displayImage: '/imgs/Backgrounds/Tan 4.jpg',
            img: {
              background: '/imgs/Backgrounds/Tan 4.jpg'
            },
            key: 't4'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Tan 5',
            displayImage: '/imgs/Backgrounds/Tan 5.jpg',
            img: {
              background: '/imgs/Backgrounds/Tan 5.jpg'
            },
            key: 't5'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Tan 6',
            displayImage: '/imgs/Backgrounds/Tan 6.jpg',
            img: {
              background: '/imgs/Backgrounds/Tan 6.jpg'
            },
            key: 't6'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Tan 7',
            displayImage: '/imgs/Backgrounds/Tan 7.jpg',
            img: {
              background: '/imgs/Backgrounds/Tan 7.jpg'
            },
            key: 't7'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Tan 8',
            displayImage: '/imgs/Backgrounds/Tan 8.jpg',
            img: {
              background: '/imgs/Backgrounds/Tan 8.jpg'
            },
            key: 't8'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Tan 9',
            displayImage: '/imgs/Backgrounds/Tan 9.jpg',
            img: {
              background: '/imgs/Backgrounds/Tan 9.jpg'
            },
            key: 't9'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Kraft Paper',
            displayImage: '/imgs/Backgrounds/Kraft Paper.jpg',
            img: {
              background: '/imgs/Backgrounds/Kraft Paper.jpg'
            },
            key: 'Kraft'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Brown 1',
            displayImage: '/imgs/Backgrounds/Brown 1.jpg',
            key: 'brown1',
            img: {
              color: 'white',
              background: '/imgs/Backgrounds/Brown 1.jpg'
            },
            reset: ['fontColor']
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Brown 2',
            displayImage: '/imgs/Backgrounds/Brown 2.jpg',
            key: 'brown2',
            img: {
              color: 'white',
              background: '/imgs/Backgrounds/Brown 2.jpg'
            },
            reset: ['fontColor']
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Gray',
            displayImage: '/imgs/Backgrounds/Gray.jpg',
            img: {
              background: '/imgs/Backgrounds/Gray.jpg'
            },
            key: 'gray'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Green 1',
            displayImage: '/imgs/Backgrounds/Green 1.jpg',
            img: {
              background: '/imgs/Backgrounds/Green 1.jpg'
            },
            key: 'green1'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Green 2',
            displayImage: '/imgs/Backgrounds/Green 2.jpg',
            img: {
              background: '/imgs/Backgrounds/Green 2.jpg'
            },
            key: 'green2'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Green-Blue',
            displayImage: '/imgs/Backgrounds/Green-Blue.jpg',
            img: {
              background: '/imgs/Backgrounds/Green-Blue.jpg'
            },
            key: 'greenblue'
          },
          {
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            displayText: 'Red',
            displayImage: '/imgs/Backgrounds/Red.jpg',
            key: 'red',
            img: {
              color: 'white',
              background: '/imgs/Backgrounds/Red.jpg'
            },
            reset: ['fontColor']
          },
          {
            displayText: 'Black',
            displayImage: '/imgs/Backgrounds/Black.jpg',
            key: 'black',
            prereq: {
              option: 'style2',
              value: ['classic']
            },
            img: {
              color: 'white',
              background: '/imgs/Backgrounds/Black.jpg'
            },
            reset: ['fontColor']
          },
          {
            prereq: {
              option: 'style2',
              value: ['chalk']
            },
            default: true,
            displayText: 'Chalkboard 1',
            displayImage: '/imgs/Backgrounds/Chalk 1.jpg',
            img: {
              background: '/imgs/Backgrounds/Chalk 1.jpg'
            },
            key: 'chalk1'
          },
          {
            prereq: {
              option: 'style2',
              value: ['chalk']
            },
            displayText: 'Chalkboard 2',
            displayImage: '/imgs/Backgrounds/Chalk 2.jpg',
            img: {
              background: '/imgs/Backgrounds/Chalk 2.jpg'
            },
            key: 'chalk2'
          },
          {
            prereq: {
              option: 'style2',
              value: ['chalk']
            },
            displayText: 'Chalkboard 3',
            displayImage: '/imgs/Backgrounds/Chalk 3.jpg',
            img: {
              background: '/imgs/Backgrounds/Chalk 3.jpg'
            },
            key: 'chalk3'
          },
          {
            prereq: {
              option: 'style2',
              value: ['chalk']
            },
            displayText: 'Black',
            displayImage: '/imgs/Backgrounds/Black.jpg',
            img: {
              background: '/imgs/Backgrounds/Black.jpg'
            },
            key: 'black'
          }
        ],
        required: true
      }
    ]
  })
);
/** Page 8 - Font Color **/
config.addPage(
  new TreeArtPage({
    //Page 8
    title: 'Select a font color',
    intro: '',
    prereq: {
      option: 'style2',
      value: ['classic'],
      and: {
        option: 'background',
        not_value: ['brown1', 'brown2', 'red', 'black']
      }
    },
    options: [
      {
        name: '',
        type: 'button',
        id: 'fontColor',
        required: true,
        buttons: [
          {
            displayText: 'Black',
            default: true,
            key: 'black',
            img: {
              color: 'black'
            }
          },
          {
            displayText: 'Brown',
            key: 'brown',
            prereq: {
              option: 'background',
              not_value: ['brown1', 'brown2', 'gray', 'red', 'green2']
            },
            img: {
              color: 'brown'
            }
          },
          {
            displayText: 'White',
            key: 'white',
            prereq: {
              option: 'background',
              not_value: ['s&g', 's&g2', 't1', 't2', 'sky_blue 1', 'sky_blue 2']
            },
            img: {
              color: 'white'
            }
          }
        ]
      }
    ]
  })
);
/** Page 9 - Leaves **/
config.addPage(
  new TreeArtPage({
    //Page 9
    title: 'Do you want leaves on your tree?',
    intro: '',
    options: [
      {
        name: '',
        type: 'button',
        id: 'leaves',
        layer: 4,
        buttons: [
          {
            displayText: 'Yes ($10)',
            summaryText: 'Add Leaves',
            key: 'yes',
            cost: 10,
            img: {
              leaves: true
            }
          },
          {
            displayText: 'No',
            key: 'no'
          }
        ],
        required: true
      }
    ]
  })
);
/** Page 10 - Other Text **/
config.addPage(
  new TreeArtPage({
    //Page 10
    title: 'Do you want to add additional text?',
    intro:
      '*Optional text can be added to make your tree just the way you want it.<br/><br>',
    footer: '',
    options: [
      {
        name: '<strong>Family Name:</strong>&nbsp;&nbsp;',
        type: 'text',
        id: 'familyName',
        placeholder: 'ex:The Jones Family'
      },
      {
        name: '<strong>Established:</strong>&nbsp;&nbsp;',
        type: 'text',
        id: 'lineTwo',
        placeholder: 'Established 1970'
      },
      {
        name: 'Family Name Font:&nbsp;&nbsp;',
        prereq: {
          option: 'style2',
          value: ['classic']
        },
        type: 'dropdown',
        id: 'familyFont',
        items: [
          {
            default: true,
            displayText: 'Scriptina + Monotype Corsiva',
            font: 'MType-Script',
            key: 'mtype-script'
          },
          {
            displayText: 'Monotype Corsiva',
            font: 'MType',
            key: 'monotype'
          },
          {
            displayText: 'Amazone',
            font: 'Amaze',
            key: 'amazone'
          },
          {
            displayText: 'Papyrus',
            font: 'Papyrus8',
            key: 'papyrus'
          }
        ]
      },
      {
        name: 'Family Name Location',
        type: 'button',
        id: 'nameLoc',
        buttons: [
          {
            displayText: 'Left',
            position: 'left',
            key: 'left',
            default: true,
            onselect: () => {
              const pg = get(page);
              const selectedQuote = <BaseData>get(selections).quoteLoc;
              if (selectedQuote?.key != 'left') return;
              const quoteOpt: ButtonOption = <ButtonOption>pg.options[6];
              selectItem('quoteLoc', quoteOpt.buttons[1], false);
            }
          },
          {
            displayText: 'Right',
            position: 'right',
            key: 'right',
            onselect: () => {
              const pg = get(page);
              const selectedQuote = <BaseData>get(selections).quoteLoc;
              if (selectedQuote?.key != 'right') return;
              const quoteOpt: ButtonOption = <ButtonOption>pg.options[6];
              selectItem('quoteLoc', quoteOpt.buttons[0], false);
            }
          },
          {
            displayText: 'Center',
            position: 'center',
            key: 'center',
            prereq: {
              option: 'type',
              value: ['ancestry', 'descendant'],
              and: {
                option: 'ground',
                value: []
              }
            },
            reset: ['ground']
          }
        ]
      },
      {
        name:
          '<br><strong>Quote or Saying:  </strong> &nbsp;&nbsp;' +
          '</tr><tr><td colspan="2"></td><td colspan="2">Need some quote ideas? Click <a target="_blank" href="https://customfamilytreeart.com/quotes">here</a>',
        type: 'text',
        id: 'quote',
        placeholder: 'Place a quote or saying here.'
      },
      {
        name: 'Quote Font: &nbsp;&nbsp; ',
        prereq: {
          option: 'style2',
          value: ['classic']
        },
        type: 'dropdown',
        id: 'quoteFont',
        items: [
          {
            displayText: 'Monotype Corsiva',
            font: 'MType',
            default: true,
            key: 'monotype'
          },
          {
            displayText: 'Amazone',
            font: 'Amaze',
            key: 'amazone'
          },
          {
            displayText: 'Papyrus',
            font: 'Papyrus',
            key: 'papyrus'
          }
        ]
      },
      {
        name: 'Quote Location',
        type: 'button',
        id: 'quoteLoc',
        buttons: [
          {
            displayText: 'Left',
            position: 'left',
            key: 'left',
            onselect: () => {
              const pg = get(page);
              const selectedName = <BaseData>get(selections)['nameLoc'];
              if (selectedName?.key != 'left') return;
              const quoteOpt: ButtonOption = <ButtonOption>pg.options[3];
              selectItem('nameLoc', quoteOpt.buttons[1], false);
            }
          },
          {
            displayText: 'Right',
            position: 'right',
            key: 'right',
            default: true,
            onselect: () => {
              const pg = get(page);
              const selectedName = <BaseData>get(selections)['nameLoc'];
              if (selectedName?.key != 'right') return;
              const quoteOpt: ButtonOption = <ButtonOption>pg.options[3];
              selectItem('nameLoc', quoteOpt.buttons[0], false);
            }
          }
        ]
      },
      {
        prereq: {
          option: 'type',
          value: ['ancestry_roots', 'descendant_roots']
        },
        required: true,
        name: '<br><strong>Ground Text: </strong> &nbsp;&nbsp;',
        type: 'text',
        id: 'ground',
        placeholder: 'Add a quote or saying here',
        onupdate: () => {
          const pg = get(page);
          const selectedName = <BaseData>get(selections)['nameLoc'];
          if (selectedName.key != 'center') return;
          const nameOpt: ButtonOption = <ButtonOption>pg.options[3];
          selectItem('nameLoc', nameOpt.buttons[0]);
        }
      },
      {
        prereq: {
          option: 'type',
          value: ['ancestry', 'descendant']
        },
        name: '<br><strong>Ground Text: </strong> &nbsp;&nbsp;',
        type: 'text',
        id: 'ground',
        placeholder: 'Add a quote or saying here',
        onupdate: () => {
          const pg = get(page);
          const selectedName = <BaseData>get(selections)['nameLoc'];
          if (selectedName.key != 'center') return;
          const nameOpt: ButtonOption = <ButtonOption>pg.options[3];
          selectItem('nameLoc', nameOpt.buttons[1]);
        }
      },
      {
        name: 'Ground Font: &nbsp;&nbsp; ',
        prereq: {
          option: 'style2',
          value: ['classic']
        },
        type: 'dropdown',
        id: 'groundFont',
        items: [
          {
            displayText: 'Monotype Corsiva',
            font: 'MType',
            default: true,
            key: 'monotype'
          },
          {
            displayText: 'Amazone',
            font: 'Amaze',
            key: 'amazone'
          },
          {
            displayText: 'Papyrus',
            font: 'Papyrus',
            key: 'papyrus'
          }
        ]
      },
      {
        name: 'Flat Ground',
        type: 'button',
        id: 'flatGround',
        buttons: [
          {
            displayText: 'Yes',
            key: 'yes',
          },
          {
            displayText: 'No',
            key: 'no',
            default: true
          }
        ]
      }
    ]
  })
);
/** Page 11 - Double Trunk **/
config.addPage(
  new TreeArtPage({
    //Page 11
    title: 'Do you want a Double Trunk?',
    prereq: {
      option: 'ancType',
      value: ['ancestry_couple'],
      or: {
        option: 'type',
        value: ['descendant', 'descendant_roots']
      }
    },
    intro: `
			Double trunks usually work best with 2 people. Birthdates are added after each name to get the needed length.<br><br>
			<img src='/imgs/Option Examples/Double Trunk Examples.jpg' class='full-width' alt='Example'/><br>
			The image of the example tree you've been building won't change based on your selection, but we will create your tree with a double trunk if you select "Yes" here.
			`,
    options: [
      {
        name: '',
        id: 'doubleTrunk',
        type: 'button',
        buttons: [
          {
            displayText: 'Yes',
            summaryText: 'Double Trunk: Yes',
            key: 'yes'
          },
          {
            displayText: 'No',
            key: 'no',
            default: true
          }
        ]
      }
    ]
  })
);
/** Page 12 - Main Print **/
config.addPage(
  new TreeArtPage({
    //Page 12
    title: 'What kind of print would you like?',
    intro:
      '<b>If you are outside the CONTINENTAL U.S. please select the Digital Copy option. Shipping costs are too high to ship prints internationally.</b><br/>' +
      'With the digital JPG file you will be able to have your tree printed locally as many times as you want.<br/>' +
      '<br/><b>Learn more about each print type <a target="_blank" href="https://customfamilytreeart.com/prints">here</a></b><br/>',
    options: [
      {
        name: '',
        id: 'printType',
        type: 'image',
        required: true,
        images: [
          {
            displayText: '<b>Standard Print</b>',
            displayImage: '/imgs/Products/Standard Print.jpg',
            key: 'standard',
            summaryText: 'Print Type: Standard',
            reset: ['texture']
          },
          {
            displayText: '<b>Mounted & Textured Print</b>',
            displayImage: '/imgs/Products/M&T Print.jpg',
            key: 'm&t',
            summaryText: 'Print Type: Mounted & Textured',
            reset: ['texture']
          },
          {
            displayText: '<b>1.25" Gallery Wrapped Canvas</b>',
            displayImage: '/imgs/Products/Gallery Wrapped Canvas.jpg',
            key: 'canvas',
            summaryText: 'Print Type: Canvas',
            reset: ['texture', 'frame']
          },
          {
            displayText: '<b>Full Resolution Digital File ($60)</b>',
            displayImage: '/imgs/Products/Digital Copy.png',
            cost: 60,
            key: 'digital',
            summaryText: 'Digital Copy',
            reset: ['extraDigital', 'printSize', 'texture', 'shipping']
          }
        ]
      },
      {
        name: '<h3>Which texture do you prefer?</h3>',
        id: 'texture',
        type: 'image',
        required: true,
        prereq: {
          option: 'printType',
          value: ['m&t']
        },
        images: [
          {
            displayText: 'Linen Texture',
            displayImage: '/imgs/Option Examples/Linen Texture.jpg',
            summaryText: 'Texture: Linen',
            key: 'linen'
          },
          {
            displayText: 'Canvas Texture',
            displayImage: '/imgs/Option Examples/Canvas Texture.jpg',
            summaryText: 'Texture: Canvas',
            key: 'canvas'
          }
        ]
      },
      {
        name: '<h3>What size print would you like?</h3>',
        id: 'printSize',
        type: 'button',
        flexCount: 5,
        required: true,
        // default: true,
        prereq: {
          option: 'printType',
          value: ['standard', 'm&t', 'canvas']
        },
        buttons: [
          //Standard print
          {
            displayText: '8x10 &nbsp;(%value%)',
            placeholder: '8x10',
            key: '8x10',
            values: [
              {
                option: 'printType',
                value: ['standard'],
                cost: 19
              },
              {
                option: 'printType',
                value: ['m&t'],
                cost: 29
              },
              {
                option: 'printType',
                value: ['canvas'],
                cost: 59
              }
            ],
            summaryText: 'Print Size: 8x10'
          },
          {
            displayText: '11x14 (%value%)',
            placeholder: '11x14',
            key: '11x14',
            values: [
              {
                option: 'printType',
                value: ['standard'],
                cost: 29
              },
              {
                option: 'printType',
                value: ['m&t'],
                cost: 49
              },
              {
                option: 'printType',
                value: ['canvas'],
                cost: 75
              }
            ],
            summaryText: 'Print Size: 11x14'
          },
          {
            displayText: '16x20 (%value%)',
            placeholder: '16x20',
            key: '16x20',
            values: [
              {
                option: 'printType',
                value: ['standard'],
                cost: 49
              },
              {
                option: 'printType',
                value: ['m&t'],
                cost: 79
              },
              {
                option: 'printType',
                value: ['canvas'],
                cost: 89
              }
            ],
            summaryText: 'Print Size: 16x20'
          },
          {
            displayText: '20x24 (%value%)',
            placeholder: '20x24',
            key: '20x24',
            values: [
              {
                option: 'printType',
                value: ['standard'],
                cost: 75
              },
              {
                option: 'printType',
                value: ['m&t'],
                cost: 109
              },
              {
                option: 'printType',
                value: ['canvas'],
                cost: 125
              }
            ],
            summaryText: 'Print Size: 20x24'
          },
          {
            displayText: '24x30 (%value%)',
            placeholder: '24x30',
            key: '24x30',
            values: [
              {
                option: 'printType',
                value: ['standard'],
                cost: 109
              },
              {
                option: 'printType',
                value: ['m&t'],
                cost: 155
              },
              {
                option: 'printType',
                value: ['canvas'],
                cost: 165
              }
            ],
            summaryText: 'Print Size: 24x30'
          }
        ]
      },
      {
        name: `<h3>Would you like a digital copy in addition to your print?</h3>`,
        id: 'extraDigital',
        type: 'button',
        prereq: {
          option: 'printType',
          value: ['standard', 'm&t', 'canvas']
        },
        buttons: [
          {
            displayText: 'Yes ($39)',
            cost: 39,
            summaryText: 'Extra Digital Copy',
            key: 'yes'
          },
          {
            displayText: 'No',
            summaryText: 'No Digital Copy',
            key: 'no'
          }
        ]
      }
    ]
  })
);
/** Page 13 - Frames **/
config.addPage(
  new TreeArtPage({
    //Page 13       Don't show if they selected JPG
    title: 'Do you want a frame for your tree?',
    intro:
      '<b>Learn more about frames <a target="_blank" href="https://customfamilytreeart.com/frames">here</a></b>',
    prereq: {
      option: 'printType',
      // value: ["print", "both"]
      value: ['standard', 'm&t']
    },
    options: [
      {
        name: '',
        id: 'frame',
        type: 'image',
        flexCount: 3,
        images: [
          {
            displayText: 'None',
            key: 'none',
            default: true,
            displayImage: '/imgs/Products/No Frame.jpg'
          },
          {
            displayText: 'Natural Barnwood ~ 2.25" (%value%)',
            key: 'natural_barnwood',
            placeholder: 'Natural Barnwood ~ 2.25"',
            displayImage: '/imgs/Products/Natural Barnwood Corner.jpg',
            summaryText: 'Natural Barnwood Frame',
            values: [
              {
                option: 'printSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'printSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'printSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'printSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'printSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Whitewashed Barnwood ~ 2.25" (%value%)',
            key: 'white_barnwood',
            placeholder: 'Whitewashed Barnwood ~ 2.25"',
            displayImage: '/imgs/Products/Whitewashed Barnwood Corner.jpg',
            summaryText: 'Whitewashed Barnwood Frame',
            values: [
              {
                option: 'printSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'printSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'printSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'printSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'printSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Flat Black Wood ~ 1.125" (%value%)',
            key: 'flat_black',
            placeholder: 'Flat Black Wood ~ 1.125"',
            displayImage: '/imgs/Products/Flat Black Corner.jpg',
            summaryText: 'Flat Black Wood Frame',
            values: [
              {
                option: 'printSize',
                value: ['8x10'],
                cost: 80
              },
              {
                option: 'printSize',
                value: ['11x14'],
                cost: 99
              },
              {
                option: 'printSize',
                value: ['16x20'],
                cost: 115
              },
              {
                option: 'printSize',
                value: ['20x24'],
                cost: 150
              },
              {
                option: 'printSize',
                value: ['24x30'],
                cost: 185
              }
            ]
          },
          {
            displayText: 'Flat White Wood ~ 1.125" (%value%)',
            key: 'flat_white',
            placeholder: 'Flat White Wood ~ 1.125"',
            displayImage: '/imgs/Products/Flat White Corner.jpg',
            summaryText: 'Flat White Wood Frame',
            values: [
              {
                option: 'printSize',
                value: ['8x10'],
                cost: 80
              },
              {
                option: 'printSize',
                value: ['11x14'],
                cost: 99
              },
              {
                option: 'printSize',
                value: ['16x20'],
                cost: 115
              },
              {
                option: 'printSize',
                value: ['20x24'],
                cost: 150
              },
              {
                option: 'printSize',
                value: ['24x30'],
                cost: 185
              }
            ]
          },
          {
            displayText: 'Mocha Wood ~ 1.125" (%value%)',
            key: 'mocha',
            placeholder: 'Mocha Wood ~ 1.125"',
            displayImage: '/imgs/Products/Mocha Corner.jpg',
            summaryText: 'Mocha Wood Frame',
            values: [
              {
                option: 'printSize',
                value: ['8x10'],
                cost: 80
              },
              {
                option: 'printSize',
                value: ['11x14'],
                cost: 99
              },
              {
                option: 'printSize',
                value: ['16x20'],
                cost: 115
              },
              {
                option: 'printSize',
                value: ['20x24'],
                cost: 150
              },
              {
                option: 'printSize',
                value: ['24x30'],
                cost: 185
              }
            ]
          },
          {
            displayText: 'Natural Basswood ~ 1.125" (%value%)',
            key: 'basswood',
            placeholder: 'Natural Basswood ~ 1.125"',
            displayImage: '/imgs/Products/Natural Basswood Corner.jpg',
            summaryText: 'Natural Basswood Frame',
            values: [
              {
                option: 'printSize',
                value: ['8x10'],
                cost: 80
              },
              {
                option: 'printSize',
                value: ['11x14'],
                cost: 99
              },
              {
                option: 'printSize',
                value: ['16x20'],
                cost: 115
              },
              {
                option: 'printSize',
                value: ['20x24'],
                cost: 150
              },
              {
                option: 'printSize',
                value: ['24x30'],
                cost: 185
              }
            ]
          },
          {
            displayText: 'Classic Black ~ 1.625" (%value%)',
            key: 'classic_black',
            placeholder: 'Classic Black ~ 1.625"',
            displayImage: '/imgs/Products/Black Americana Corner.jpg',
            summaryText: 'Classic Black Frame',
            values: [
              {
                option: 'printSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'printSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'printSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'printSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'printSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Black & Silver Scoop ~ 1.75" (%value%)',
            key: 'black_silver',
            placeholder: 'Black & Silver Scoop ~ 1.75"',
            displayImage: '/imgs/Products/Black & Silver Scoop Corner.jpg',
            summaryText: 'Black & Silver Scoop Frame',
            values: [
              {
                option: 'printSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'printSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'printSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'printSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'printSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Black Scoop ~ 2" (%value%)',
            key: 'black_scoop',
            placeholder: 'Black Scoop ~ 2"',
            displayImage: '/imgs/Products/Black Scoop Corner.jpg',
            summaryText: 'Black Scoop Frame',
            values: [
              {
                option: 'printSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'printSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'printSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'printSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'printSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Gold Scoop ~ 2" (%value%)',
            key: 'gold_scoop',
            placeholder: 'Gold Scoop ~ 2"',
            displayImage: '/imgs/Products/Gold Scoop Corner.jpg',
            summaryText: 'Gold Scoop Frame',
            values: [
              {
                option: 'printSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'printSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'printSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'printSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'printSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Pewter Scoop ~ 2" (%value%)',
            key: 'pewter_scoop',
            placeholder: 'Pewter Scoop ~ 2"',
            displayImage: '/imgs/Products/Pewter Scoop Corner.jpg',
            summaryText: 'Pewter Scoop Frame',
            values: [
              {
                option: 'printSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'printSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'printSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'printSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'printSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          }
        ]
      }
    ]
  })
);
/** Page 14 - Additional Prints **/
config.addPage(
  new TreeArtPage({
    //Page 14
    title: 'Do you want any additional prints?',
    intro: '',
    prereq: {
      option: 'printType',
      // value: ["print", "both"]
      value: ['standard', 'm&t', 'canvas']
    },
    multiselect: new MultiSelectData({
      display: 'Additional Prints',
      id: 'additionalPrints',
      keys: [
        'addPrintType',
        'addPrintSize',
        'addQty',
        'addUseFrame',
        'addFrame'
      ],
      quantifier: 'addQty',
      format: '%addQty%x %addPrintType% - %addPrintSize%%addFrame%',
      paypal: '%addPrintType% - %addPrintSize%%addFrame%',
      prereq: {
        option: 'addPrintSize',
        value: ['8x10', '11x14', '16x20', '20x24', '24x30']
      }
    }),
    options: [
      {
        name: '',
        id: 'addPrintType',
        type: 'image',
        // total: false,
        images: [
          {
            displayText: 'Standard Print',
            displayImage: '/imgs/Products/Standard Print.jpg',
            key: 'standard'
          },
          {
            displayText: 'Mounted & Textured Print',
            displayImage: '/imgs/Products/M&T Print.jpg',
            key: 'm&t'
          },
          {
            displayText: '1 1/2" Gallery Wrapped Canvas',
            displayImage: '/imgs/Products/Gallery Wrapped Canvas.jpg',
            key: 'canvas'
          }
        ]
      },
      {
        name: '<h3>What size print would you like?</h3>',
        id: 'addPrintSize',
        type: 'button',
        flexCount: 5,
        // total: false,
        prereq: {
          option: 'addPrintType',
          value: ['standard', 'm&t', 'canvas']
        },
        buttons: [
          {
            displayText: '&nbsp; 8x10 &nbsp;(%value%)',
            placeholder: '8x10',
            key: '8x10',
            values: [
              {
                option: 'addPrintType',
                value: ['standard'],
                cost: 19
              },
              {
                option: 'addPrintType',
                value: ['m&t'],
                cost: 29
              },
              {
                option: 'addPrintType',
                value: ['canvas'],
                cost: 59
              }
            ]
          },
          {
            displayText: '11x14 (%value%)',
            placeholder: '11x14',
            key: '11x14',
            values: [
              {
                option: 'addPrintType',
                value: ['standard'],
                cost: 29
              },
              {
                option: 'addPrintType',
                value: ['m&t'],
                cost: 49
              },
              {
                option: 'addPrintType',
                value: ['canvas'],
                cost: 75
              }
            ]
          },
          {
            displayText: '16x20 (%value%)',
            placeholder: '16x20',
            key: '16x20',
            values: [
              {
                option: 'addPrintType',
                value: ['standard'],
                cost: 49
              },
              {
                option: 'addPrintType',
                value: ['m&t'],
                cost: 79
              },
              {
                option: 'addPrintType',
                value: ['canvas'],
                cost: 89
              }
            ]
          },
          {
            displayText: '20x24 (%value%)',
            placeholder: '20x24',
            key: '20x24',
            values: [
              {
                option: 'addPrintType',
                value: ['standard'],
                cost: 75
              },
              {
                option: 'addPrintType',
                value: ['m&t'],
                cost: 109
              },
              {
                option: 'addPrintType',
                value: ['canvas'],
                cost: 125
              }
            ]
          },
          {
            displayText: '24x30 (%value%)',
            placeholder: '24x30',
            key: '24x30',
            values: [
              {
                option: 'addPrintType',
                value: ['standard'],
                cost: 109
              },
              {
                option: 'addPrintType',
                value: ['m&t'],
                cost: 155
              },
              {
                option: 'addPrintType',
                value: ['canvas'],
                cost: 165
              }
            ]
          }
        ]
      },
      {
        name: 'Quantity',
        id: 'addQty',
        // total: false,
        prereq: {
          option: 'addPrintSize',
          value: ['8x10', '11x14', '16x20', '20x24', '24x30']
        },
        type: 'number'
      },
      {
        name: '<h3>Do you want a frame?</h3>',
        id: 'addUseFrame',
        type: 'button',
        prereq: {
          option: 'addPrintType',
          value: ['standard', 'm&t'],
          and: {
            option: 'addPrintSize',
            value: ['8x10', '11x14', '16x20', '20x24', '24x30']
          }
        },
        buttons: [
          {
            displayText: 'Yes',
            key: 'yes'
          },
          {
            displayText: 'No',
            key: 'no',
            default: true
          }
        ]
      },
      {
        name: '<h3>What frame would you like?</h3><hr/>',
        id: 'addFrame',
        type: 'image',
        prereq: {
          option: 'addUseFrame',
          value: ['yes'],
          and: {
            option: 'addPrintType',
            value: ['standard', 'm&t']
          }
        },
        flexCount: 3,
        images: [
          {
            displayText: 'Natural Barnwood ~ 2.25" (%value%)',
            key: 'natural_barnwood',
            placeholder: ', Natural Barnwood ~ 2.25"',
            displayImage: '/imgs/Products/Natural Barnwood Corner.jpg',
            summaryText: 'Natural Barnwood Frame',
            values: [
              {
                option: 'addPrintSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'addPrintSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'addPrintSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'addPrintSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'addPrintSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Whitewashed Barnwood ~ 2.25" (%value%)',
            key: 'white_barnwood',
            placeholder: ', Whitewashed Barnwood ~ 2.25"',
            displayImage: '/imgs/Products/Whitewashed Barnwood Corner.jpg',
            summaryText: 'Whitewashed Barnwood Frame',
            values: [
              {
                option: 'addPrintSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'addPrintSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'addPrintSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'addPrintSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'addPrintSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Flat Black Wood ~ 1.125" (%value%)',
            key: 'flat_black',
            placeholder: ', Flat Black Wood ~ 1.125"',
            displayImage: '/imgs/Products/Flat Black Corner.jpg',
            summaryText: 'Flat Black Wood Frame',
            values: [
              {
                option: 'addPrintSize',
                value: ['8x10'],
                cost: 80
              },
              {
                option: 'addPrintSize',
                value: ['11x14'],
                cost: 99
              },
              {
                option: 'addPrintSize',
                value: ['16x20'],
                cost: 115
              },
              {
                option: 'addPrintSize',
                value: ['20x24'],
                cost: 150
              },
              {
                option: 'addPrintSize',
                value: ['24x30'],
                cost: 185
              }
            ]
          },
          {
            displayText: 'Flat White Wood ~ 1.125" (%value%)',
            key: 'flat_white',
            placeholder: ', Flat White Wood ~ 1.125"',
            displayImage: '/imgs/Products/Flat White Corner.jpg',
            summaryText: 'Flat White Wood Frame',
            values: [
              {
                option: 'addPrintSize',
                value: ['8x10'],
                cost: 80
              },
              {
                option: 'addPrintSize',
                value: ['11x14'],
                cost: 99
              },
              {
                option: 'addPrintSize',
                value: ['16x20'],
                cost: 115
              },
              {
                option: 'addPrintSize',
                value: ['20x24'],
                cost: 150
              },
              {
                option: 'addPrintSize',
                value: ['24x30'],
                cost: 185
              }
            ]
          },
          {
            displayText: 'Mocha Wood ~ 1.125" (%value%)',
            key: 'mocha',
            placeholder: ', Mocha Wood ~ 1.125"',
            displayImage: '/imgs/Products/Mocha Corner.jpg',
            summaryText: 'Mocha Wood Frame',
            values: [
              {
                option: 'addPrintSize',
                value: ['8x10'],
                cost: 80
              },
              {
                option: 'addPrintSize',
                value: ['11x14'],
                cost: 99
              },
              {
                option: 'addPrintSize',
                value: ['16x20'],
                cost: 115
              },
              {
                option: 'addPrintSize',
                value: ['20x24'],
                cost: 150
              },
              {
                option: 'addPrintSize',
                value: ['24x30'],
                cost: 185
              }
            ]
          },
          {
            displayText: 'Natural Basswood ~ 1.125" (%value%)',
            key: 'basswood',
            placeholder: ', Natural Basswood ~ 1.125"',
            displayImage: '/imgs/Products/Natural Basswood Corner.jpg',
            summaryText: 'Natural Basswood Frame',
            values: [
              {
                option: 'addPrintSize',
                value: ['8x10'],
                cost: 80
              },
              {
                option: 'addPrintSize',
                value: ['11x14'],
                cost: 99
              },
              {
                option: 'addPrintSize',
                value: ['16x20'],
                cost: 115
              },
              {
                option: 'addPrintSize',
                value: ['20x24'],
                cost: 150
              },
              {
                option: 'addPrintSize',
                value: ['24x30'],
                cost: 185
              }
            ]
          },
          {
            displayText: 'Classic Black ~ 1.625" (%value%)',
            key: 'classic_black',
            placeholder: ', Classic Black ~ 1.625"',
            displayImage: '/imgs/Products/Black Americana Corner.jpg',
            summaryText: 'Classic Black Frame',
            values: [
              {
                option: 'addPrintSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'addPrintSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'addPrintSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'addPrintSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'addPrintSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Black & Silver Scoop ~ 1.75" (%value%)',
            key: 'black_silver',
            placeholder: ', Black & Silver Scoop ~ 1.75"',
            displayImage: '/imgs/Products/Black & Silver Scoop Corner.jpg',
            summaryText: 'Black & Silver Scoop Frame',
            values: [
              {
                option: 'addPrintSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'addPrintSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'addPrintSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'addPrintSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'addPrintSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Black Scoop ~ 2" (%value%)',
            key: 'black_scoop',
            placeholder: ', Black Scoop ~ 2"',
            displayImage: '/imgs/Products/Black Scoop Corner.jpg',
            summaryText: 'Black Scoop Frame',
            values: [
              {
                option: 'addPrintSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'addPrintSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'addPrintSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'addPrintSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'addPrintSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Gold Scoop ~ 2" (%value%)',
            key: 'gold_scoop',
            placeholder: ', Gold Scoop ~ 2"',
            displayImage: '/imgs/Products/Gold Scoop Corner.jpg',
            summaryText: 'Gold Scoop Frame',
            values: [
              {
                option: 'addPrintSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'addPrintSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'addPrintSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'addPrintSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'addPrintSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          },
          {
            displayText: 'Pewter Scoop ~ 2" (%value%)',
            key: 'pewter_scoop',
            placeholder: ', Pewter Scoop ~ 2"',
            displayImage: '/imgs/Products/Pewter Scoop Corner.jpg',
            summaryText: 'Pewter Scoop Frame',
            values: [
              {
                option: 'addPrintSize',
                value: ['8x10'],
                cost: 90
              },
              {
                option: 'addPrintSize',
                value: ['11x14'],
                cost: 110
              },
              {
                option: 'addPrintSize',
                value: ['16x20'],
                cost: 130
              },
              {
                option: 'addPrintSize',
                value: ['20x24'],
                cost: 170
              },
              {
                option: 'addPrintSize',
                value: ['24x30'],
                cost: 220
              }
            ]
          }
        ]
      }
    ]
  })
);
/** Page 15 - Additional Details **/
config.addPage(
  new TreeArtPage({
    //Page 15
    title: `Do you want your tree by a certain date? We'll do our best!`,
    intro:
      '<b>Find out more about turnaround and shipping times <a target="_blank" href="https://customfamilytreeart.com/shipping">here</a></b>',
    options: [
      {
        display: 'Request Date: ',
        name: '',
        id: 'requestDate',
        type: 'date'
      },
      {
        name: '<h3>Do you have any other comments or questions?</h3>',
        display: 'Additional Comments: ',
        id: 'comments',
        type: 'textLong',
        placeholder: 'Enter any other comments/requests here.'
      }
    ]
  })
);
/** Page 16 - Shipping **/
// TODO Make it so you can't skip this page if you click 'Jump to Cart' button -- current defect
config.addPage(
  new TreeArtPage({
    //Page 16 - Shipping!
    title: 'How do you want your products shipped?',
    intro:
      '<b>These shipping options are for the CONTINENTAL U.S. only.</b><br/>' +
      'Shipping costs for all other locations are too high. Please select Digital Copy only so that you can have it printed locally.<br/>' +
      '<b>Production and shipping times may be 2 to 3 times longer than normal because of labor shortages at the printing facility and shipping company. ' +
      'Please order early!</b><br/>',
    prereq: {
      option: 'printType',
      value: ['standard', 'm&t', 'canvas']
    },
    options: [
      {
        name: '',
        type: 'button',
        id: 'shipping',
        buttons: [
          {
            displayText: 'Standard Shipping  3-10 Days (%value%)',
            default: true,
            key: 'standard',
            summaryText: 'Standard Shipping 3-10 Days',
            values: [
              {
                option: ['frame', 'addFrame'],
                value: [
                  'natural_barnwood',
                  'white_barnwood',
                  'flat_black',
                  'flat_white',
                  'mocha',
                  'basswood',
                  'classic_black',
                  'black_silver',
                  'black_scoop',
                  'gold_scoop',
                  'pewter_scoop'
                ],
                cost: 18.99
              },
              {
                option: 'printType',
                value: ['standard', 'm&t'],
                cost: 8.99
              },
              {
                option: 'printType',
                value: ['canvas'],
                cost: 18.99
              }
            ]
          },
          {
            displayText: '2 Day Shipping (%value%)',
            key: '2-day',
            summaryText: '2 Day Shipping',
            values: [
              {
                option: ['frame', 'addFrame'],
                value: [
                  'natural_barnwood',
                  'white_barnwood',
                  'flat_black',
                  'flat_white',
                  'mocha',
                  'basswood',
                  'classic_black',
                  'black_silver',
                  'black_scoop',
                  'gold_scoop',
                  'pewter_scoop'
                ],
                cost: 28.99
              },
              {
                option: 'printType',
                value: ['standard', 'm&t'],
                cost: 15.99
              },
              {
                option: 'printType',
                value: ['canvas'],
                cost: 28.99
              }
            ]
          },
          {
            displayText: '1 Day Shipping (%value%)',
            key: '1-day',
            summaryText: '1 Day Shipping',
            values: [
              {
                option: ['frame', 'addFrame'],
                value: [
                  'natural_barnwood',
                  'white_barnwood',
                  'flat_black',
                  'flat_white',
                  'mocha',
                  'basswood',
                  'classic_black',
                  'black_silver',
                  'black_scoop',
                  'gold_scoop',
                  'pewter_scoop'
                ],
                cost: 38.99
              },
              {
                option: 'printType',
                value: ['standard', 'm&t'],
                cost: 25.99
              },
              {
                option: 'printType',
                value: ['canvas'],
                cost: 38.99
              }
            ]
          }
        ]
      }
    ]
  })
);
/** Final Page (17) - Overview **/
config.addPage(
  new TreeArtPage({
    //Final page.
    title: 'Your order is ready to submit! Please check out below.',
    intro: `After you place your order, you will receive an email from us that will have the name form(s) you need. If you don't see it soon, check your junk folder.
					Enter your family names as directed by the form and email them to us.
					<br>If you have any questions, please send us an email at <a href='mailto:Order@customfamilytreeart.com'>Order@CustomFamilyTreeArt.com</a>`,
    options: [],
    finalPage: true
  })
);

export { config };
