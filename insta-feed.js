// Controles 
var usuario_instagram = "Digite seu username do Instagram"
var qtd_itens = 6; // MAX 12
var img_width = '188px';
var img_height = '188px';
var img_padding = '5px';

// Estilo do conteúdo
const css =
	`
.insta-feed-user-posts{
	display: flex;
	justify-content: center;
    flex-wrap: wrap;
}
.return-pictures img{
	width: ${img_width};
	height: ${img_height};
	padding: ${img_padding};
}`

// Criando Div que vai gerar todo conteúdo.
const template = document.createElement('template');
template.innerHTML =
`
<style>
${css}
</style>

<div class="insta-feed-user-posts">	</div>
`



class InstaFeed extends HTMLElement {
	constructor() {
		super();
		// element created
		this._shadowRoot = this.attachShadow({
			mode: 'open'
		})
		this._shadowRoot.appendChild(template.content.cloneNode(true))
	}

	connectedCallback() {
		this.username = usuario_instagram
		this.render()
	}

	async fetchData(username) {
		const res = await fetch(`https://www.instagram.com/${username}/?__a=1`)
		const data = await res.json()
		return data
	}

	renderPosts(arr = []) {
		var i = -1;
		arr.forEach((data) => {
			i += 1;
			if (i < qtd_itens) {

				this._shadowRoot.querySelector(".insta-feed-user-posts").innerHTML +=
					`
					<div class="return-pictures ${'photo-ig'+i}">
      					<a href="https://instagram.com/p/${data.node.shortcode}" target="_blank">
                			<img src="${data.node.display_url}" />
            			</a>
					</div>
					`
			}
		})
	}


	renderError(err) {
		this._shadowRoot.querySelector('.insta-feed-user-img').innerHTML =
			` <h3>Não foi possível encontrar nenhuma imagem (404).</h3> `
	}

	async render() {
		try {
			const {
				graphql
			} = await this.fetchData(this.username)
			this.renderPosts(graphql.user.edge_owner_to_timeline_media.edges)
		} catch (err) {
			this.renderError(err)
		}
	}
}

customElements.define("open-posts-intagram", InstaFeed)

// Developer Bruno Hashimoto
