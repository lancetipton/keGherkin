import { tapColors } from '../../tapColors'

export const itemHeader = {
  main: {
    $all: {
      backgroundColor: tapColors.displayBackground,
    },
  },
  content: {
    center: {
      content: {
        title: {
          color: tapColors?.default,
          ftWt: 'bold'
        },
      },
    },
  },
}
