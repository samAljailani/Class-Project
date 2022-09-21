app.component('friend-view', {
    props:{
        user:
            type:String,
            required: true
    }
    template:
    `
    <div id="friendWindow" style="display:none;position:absolute; width:100%; height:100%;z-index:2; background-color: rgba(0,0,0,0.7);">
        <a href="javascript:void(0)" class="closebtn text-decoration-none" onclick="closeFriendProfile();">&times;</a>
        <div id="friendProfile" class="container bg-dark rounded p-0 pb-3">
            <img style="max-height:300px; width:100%"class="rounded" src="./static/banner.jpg"/>
            <div id="_profile" class="mx-4">
                <img style="width:100%;" src="./static/mario.png"/>
            </div>
            <p id="friendUsername" style="margin-top:-5%; color:var(--primary-highlight);"class="text-start ps-3 h1"></p>
            <p id="friendId" class="text-start ps-3"></p>
            <div class="mx-2">
                <textarea id="friendBio" name="bio" style="min-height:120px;"  class="form-control text-start disabled" placeholder="Enter some info..."disabled></textarea>
                <div id="friendBioButtons" class="d-flex justify-content-end  btn-group my-2"></div>
                <p  class="h2 text-info">My HighScores:</p>
                <p id="friendHighscores"></p>

            </div>
        </div>
    </div>
    `,
    data(){

    },
    methods:{
        closeFriendProfile(){
            this.$emit('close-friend-profile')
        }
    }

})