import { mapState } from 'vuex'
export default {
    data: () => ({
        role:{
          list:null,
          obj:null
        },
        jwt_decode: ''
    }),
    computed: {
        ...mapState([
            'accessToken',
        ])
    },
    methods: {
        decodeJWT(jwt) {
            if (typeof jwt !== 'string' & !jwt instanceof String) return null

            let splitted = jwt.split('.')
            if (splitted.length < 2) return null

            let obj1 = JSON.parse(atob(splitted[0]))
            let obj2 = JSON.parse(atob(splitted[1]))

            return Object.assign({}, obj1, obj2)
        },
        getRole(){
            this.jwt_decode = this.decodeJWT(this.accessToken)
            this.role.obj = this.jwt_decode.role
            this.role.list = this.jwt_decode.role.map((val) => val.id)
        }
    }
}
