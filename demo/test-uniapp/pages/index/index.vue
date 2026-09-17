<template>
	<view class="page">
		<coolui-scroller :isEmpty="isEmpty" @refresh="refresh" @loadmore="loadmore">
			<template #refresh>
				<!-- 基础效果：下拉箭头 + 文字 -->
				<coolui-scroller-refresh type="base" :config="{ height: 60 }" />
			</template>

			<view v-for="(item, index) in list" :key="index" class="item">
				{{ item }}
			</view>

			<template #loadmore>
				<coolui-scroller-loadmore :status="loadStatus" />
			</template>
		</coolui-scroller>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isEmpty: false,
				list: [],
				page: 1,
				loadStatus: 'loading',
			}
		},
		onLoad() {
			this.getList(1)
		},
		methods: {
			getList(page) {
				return new Promise((resolve) => {
					setTimeout(() => {
						const start = (page - 1) * 10
						const arr = []
						for (let i = start; i < start + 10; i++) arr.push('数据 ' + (i + 1))
						this.list = this.list.concat(arr)
						resolve()
					}, 600)
				})
			},
			refresh() {
				this.page = 1
				this.list = []
				this.getList(1).then(() => {
					this.loadStatus = this.page >= 3 ? 'noMore' : 'more'
				})
			},
			loadmore() {
				if (this.loadStatus === 'noMore') return
				this.page++
				this.getList(this.page).then(() => {
					this.loadStatus = this.page >= 3 ? 'noMore' : 'more'
				})
			},
		},
	}
</script>

<style>
	.page {
		height: 100vh;
	}
	.item {
		padding: 30rpx;
		background: #fff;
		margin: 16rpx;
		border-radius: 12rpx;
		font-size: 28rpx;
	}
</style>
